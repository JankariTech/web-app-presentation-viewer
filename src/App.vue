<template>
  <div
    id="presentation-viewer-main"
    ref="presentationViewerRef"
    class="presentation-viewer"
    :class="{ 'dark-mode': isDarkMode }"
  >
    <AppLoadingSpinner v-if="!isReadyToShow" />
    <div ref="revealContainer" class="reveal">
      <div id="slideContainer" ref="slideContainer" class="slides">
        <section
          data-markdown
          :data-separator="dataSeparator"
          :data-separator-vertical="dataSeparatorVertical"
        >
          <textarea ref="mdTextarea" data-template />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, unref, watch } from 'vue'
import {
  AppLoadingSpinner,
  useThemeStore,
  useAppDefaults,
  useAppFileHandling,
  useClientService,
  useAppsStore
} from '@ownclouders/web-pkg'
import { Resource } from '@ownclouders/web-client/src'
import Reveal from 'reveal.js'
import RevealAwesoMD from 'revealjs-awesomd/plugin/awesoMD/awesoMD'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight'
import RevealMermaid from 'reveal.js-mermaid-plugin/plugin/mermaid/mermaid'

import 'reveal.js/dist/reveal.css'
import 'reveal.js/plugin/highlight/monokai.css'
import 'reveal.js/dist/theme/white.css'
import './css/variables.css'
import './css/templates.css'

import { getMediaMimeTypes } from './helpers/mediaMimeTypes'
import { id as appId } from '../public/manifest.json'

const themeStore = useThemeStore()
const clientService = useClientService()
const { webdav } = clientService
const { loadFolderForFileContext, currentFileContext, activeFiles } = useAppDefaults({
  applicationId: appId
})
const { getUrlForResource, revokeUrl } = useAppFileHandling({ clientService })
const appsStore = useAppsStore()

const isDarkMode = ref(themeStore.currentTheme.isDark)
const slideContainer = ref<HTMLElement>()
const revealContainer = ref<HTMLElement>()
const mdTextarea = ref<HTMLElement>()
const mediaUrls = ref<string[]>([])
const isReadyToShow = ref<boolean>(false)
const presentationViewerRef = ref<HTMLElement>()
const customCssLink = ref<HTMLStyleElement | null>(null)

const dataSeparator = '\r?\n---\r?\n'
const dataSeparatorVertical = '\r?\n--\r?\n'
const mdImageRegex = /!\[.*\]\((?!(?:http|data))(.*)\)/g
const headingSlideRegex = /^#+\s.*::slide:\s*([\w-]+)/m
const logoRegex = /(?<=logo:\s?)([^.]+\.[a-zA-Z]{3,4})/g
const templatePathRegex = /(?<=templatePath:\s?)(\S+)/g
const defaultSlideRegex = /(?<=slide:\s?)(\S+)/g

let reveal: Reveal.Api
const awesoMd = RevealAwesoMD()
const baseUrl = `${window.location.origin}/assets/apps/${appId}/templates`
awesoMd.setBaseUrl(baseUrl)
let loadTemplate = false
let customTemplate = false
let templatePathUrl = null
let templateCache: Record<string, string> = {}
let pollingInterval: ReturnType<typeof setInterval> | null = null
let templatePath = null

const { url } = defineProps({
  url: {
    type: String,
    required: true
  }
})

watch(
  () => themeStore.currentTheme.isDark,
  (isDark) => {
    isDarkMode.value = isDark
  }
)

// LIFECYCLE HOOKS
onMounted(async () => {
  await loadFolderForFileContext(unref(currentFileContext))

  // fetch the markdown file
  // build the local image urls
  await fetch(unref(url))
    .then((res) => res.text())
    .then(async (data) => {
      const parsedData = []
      for (const line of data.split('\n')) {
        const templatePathMatches = line.matchAll(templatePathRegex)
        for (const templatePathMatch of templatePathMatches) {
          templatePath = templatePathMatch[1].trim()
          customTemplate = true
        }
      }
      for (let line of data.split('\n')) {
        const matches = line.matchAll(mdImageRegex)
        for (const match of matches) {
          const imgPath = match[1]
          const imageUrl = await updateImageUrls(imgPath)
          line = line.replace(`(${imgPath})`, `(${imageUrl})`)
        }
        const logoMatches = line.matchAll(logoRegex)
        for (const logoMatch of logoMatches) {
          const logoPath = logoMatch[1].trim()
          const logoUrl = await updateImageUrls(logoPath)
          line = line.replace(`${logoPath}`, `${logoUrl}`)
        }
        if (customTemplate === true) {
          const defaultSlideMatches = line.matchAll(defaultSlideRegex)
          for (const defaultSlideMatch of defaultSlideMatches) {
            const defaultSlide = defaultSlideMatch[1].trim()
            try {
              const defaultSlideUrl = await updateTemplateUrl(templatePath, defaultSlide)
              line = line.replace(`${defaultSlide}`, `${defaultSlideUrl}`)
            } catch (error) {
              unref(mdTextarea).textContent = error
              return
            }
          }
        }
        parsedData.push(line)
      }
      unref(mdTextarea).textContent = parsedData.join('\n')
    })

  const cssLoaded = await loadCustomCss(customTemplate)

  reveal = new Reveal(unref(revealContainer), {
    plugins: [awesoMd, RevealHighlight, RevealMermaid]
  })

  await reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    controlsLayout: 'edges',
    embedded: true
  })

  if (!cssLoaded) {
    isReadyToShow.value = true
    return
  }

  if (reveal.isReady()) {
    applyTemplateIfNeeded()
    addCustomSlideNumber()
    updateImageStructure()
    fitContent()
    adjustFontSize()
  }

  reveal.addEventListener('slidechanged', function () {
    fitContent()
    adjustFontSize()
  })

  isReadyToShow.value = true

  if (customTemplate) {
    startTemplatePolling()
  }
})
onBeforeUnmount(() => {
  presentationViewerRef.value.classList.remove('md-template')
  if (customCssLink.value) {
    customCssLink.value.remove()
  }
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
  loadTemplate = false
  customTemplate = false
  templatePath = null
  unref(mediaUrls).forEach((url) => {
    revokeUrl(url)
  })
  if (reveal) {
    reveal.destroy()
  }
})

// COMPUTED
const mediaMimeTypes = computed(() =>
  getMediaMimeTypes(appsStore.externalAppConfig['preview']?.mimeTypes)
)
const mediaFiles = computed<Resource[]>(() => {
  if (!unref(activeFiles)) {
    return []
  }

  return unref(activeFiles).filter((file: Resource) => {
    if (!file.mimeType) {
      return false
    }
    return unref(mediaMimeTypes).includes(file.mimeType.toLowerCase())
  })
})

// METHODS
async function updateImageUrls(localImagePath: string) {
  // remove leading './' or '/'
  const srcPath = localImagePath.replace(/^\.\//, '').replace(/^\//, '')

  const blobUrl = await parseImageUrl(srcPath)
  if (blobUrl) {
    mediaUrls.value.push(blobUrl)
    return blobUrl
  }
  return localImagePath
}
async function parseImageUrl(name: string) {
  let file: Resource
  if (name.split('/').length > 1) {
    file = await getSubMediaFile(name)
  } else {
    file = getMediaFile(name)
  }
  if (!file) {
    return
  }
  const url = await getUrlForResource(unref(currentFileContext).space, file)
  // reload the active files
  // TODO: implement caching
  await loadFolderForFileContext(unref(currentFileContext))
  return getBlobUrl(url)
}
function getMediaFile(name: string): Resource {
  return unref(mediaFiles).find((file: Resource) => file.name === name)
}
async function getSubMediaFile(path: string): Promise<Resource> {
  const parents = dirname(path).split('/')
  const filename = basename(path)

  let currentFiles = unref(activeFiles)
  for (const parent of parents) {
    const file = findFile(parent, currentFiles)
    // return if the parent folder is not found
    if (!file) {
      return
    }

    const { children } = await webdav.listFiles(unref(currentFileContext).space, {
      path: file.path,
      fileId: file.fileId
    })

    currentFiles = children

    if (parent === parents[parents.length - 1]) {
      return findFile(filename, children)
    }
  }
}
function findFile(name: string, filesList: Resource[]): Resource {
  return filesList.find((file: Resource) => file.name === name)
}
async function getBlobUrl(url: string) {
  const data = await fetch(url).then(async (res) => await res.blob())
  const blob = new Blob([data], { type: data.type })
  return URL.createObjectURL(blob)
}
function dirname(path: string) {
  return path.split('/').slice(0, -1).join('/')
}
function basename(path: string) {
  return path.split('/').reverse()[0]
}

// custom template related
function getTemplatePath(path: string) {
  return unref(activeFiles).find((file: Resource) => file.name === path)
}

function normalizeTemplatePath(path: string): string {
  return path.replace(/^\.\//, '').replace(/^\/+/, '')
}

async function getBlobUrlFromPath(srcPath: string): Promise<string | null> {
  let file: Resource
  if (srcPath.split('/').length > 1) {
    file = await getSubMediaFile(srcPath)
  } else {
    file = getTemplatePath(srcPath)
  }

  if (!file) return null

  const url = await getUrlForResource(unref(currentFileContext).space, file)
  return await getBlobUrl(url)
}

async function updateTemplateUrl(templatePath: string, defaultSlide: string) {
  const fullSlidePath = `${templatePath}/${defaultSlide}-template.html`
  const srcPath = normalizeTemplatePath(fullSlidePath)

  const blobUrl = await getBlobUrlFromPath(srcPath)

  if (!blobUrl) {
    throw new Error(
      `Template path "${templatePath}" not found. Please check the path provided in the markdown file.`
    )
  }

  mediaUrls.value.push(blobUrl)
  const fullBlobUrl = `${blobUrl}?template=${defaultSlide}`
  return encodeURIComponent(fullBlobUrl)
}

async function loadCustomCss(customTemplate: boolean): Promise<boolean> {
  const frontMatter = separateFrontmatterAndMarkdown()[1]

  if (!customTemplate || !frontMatter.metadata?.cssFile) return true

  const cssFile = frontMatter.metadata.cssFile
  const cssFullPath = `${templatePath}/${cssFile}`
  const srcPath = normalizeTemplatePath(cssFullPath)

  const blobUrl = await getBlobUrlFromPath(srcPath)

  if (!blobUrl) {
    unref(mdTextarea).textContent = `# Error\n\nCss file "${cssFile}" not found.`
    return false
  }

  try {
    const response = await fetch(blobUrl)

    if (!response.ok) {
      unref(mdTextarea).textContent = `# Error\n\nFailed to fetch CSS file ${cssFile}.`
      return false
    }

    const cssText = await response.text()
    const style = document.createElement('style')
    style.id = 'reveal-custom-css'
    style.textContent = cssText
    document.head.appendChild(style)
    customCssLink.value = style
    return true
  } catch (err) {
    console.error('CSS fetch failed:', err)
    unref(mdTextarea).textContent = `# Error\n\nFailed to load CSS file "${cssFile}".`
    return false
  }
}

const startTemplatePolling = () => {
  pollingInterval = setInterval(async () => {
    await checkTemplateChanges()
  }, 3000)
}

const reloadPresentation = async () => {
  if (!customTemplate) return

  // re-fetch markdown and re-process
  await fetch(unref(url))
    .then((res) => res.text())
    .then((data) => {
      unref(mdTextarea).textContent = data
    })

  // destroy and re-initialize reveal
  reveal.destroy()
  reveal = new Reveal(unref(revealContainer), {
    plugins: [awesoMd, RevealHighlight, RevealMermaid]
  })
  await reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    controlsLayout: 'edges',
    embedded: true
  })
}

const checkTemplateChanges = async () => {
  if (!customTemplate || !templatePathUrl) return

  const templateFiles = [
    ...new Set(
      unref(mdTextarea)
        .textContent.match(/slide:\s*(\S+)/g)
        ?.map((m) => m.replace('slide:', '').trim()) || []
    )
  ]

  let hasChanges = false

  for (const template of templateFiles) {
    const templatePath = `${templatePathUrl}/${template}-template.html`
    const response = await fetch(templatePath)
    const content = await response.text()

    if (templateCache[template] && templateCache[template] !== content) {
      hasChanges = true
    }
    templateCache[template] = content
  }

  if (hasChanges) {
    await reloadPresentation()
  }
}

// TEMPLATE RELATED
function addCustomSlideNumber() {
  const allSlides = reveal.getSlides()
  for (const [slideNumber, slide] of Array.from(allSlides).entries()) {
    const customSlideNumber = slide.querySelector('.custom-slide-number')
    if (!customSlideNumber) {
      continue
    }
    customSlideNumber.textContent = `${slideNumber + 1}`
  }
}
function updateImageStructure() {
  if (!slideContainer.value) return
  const pTags = slideContainer.value.querySelectorAll('section p > img')
  pTags.forEach((img) => {
    const pTag = img.parentNode
    const divContainer = document.createElement('div')
    divContainer.classList.add('image-container')
    const divWrapper = document.createElement('div')
    divWrapper.classList.add('image-wrapper')
    divWrapper.appendChild(img)
    divContainer.appendChild(divWrapper)
    pTag.parentNode?.replaceChild(divContainer, pTag)
  })
}
function adjustFontSize() {
  const currentSlide = reveal.getCurrentSlide()

  function getTotalHeightOfChildren(container) {
    let totalHeight = 0
    for (const child of container.children) {
      if (currentSlide.classList.contains('title-content-image')) {
        if (child.className !== 'image-container') {
          totalHeight += getHeightWithMargin(child)
        }
      } else {
        totalHeight += getHeightWithMargin(child)
      }
    }
    return totalHeight
  }

  function getHeightWithMargin(element) {
    const style = getComputedStyle(element)
    const marginTop = parseFloat(style.marginTop)
    const marginBottom = parseFloat(style.marginBottom)
    const paddingTop = parseFloat(style.paddingTop)
    const paddingBottom = parseFloat(style.paddingBottom)
    return element.offsetHeight + marginTop + marginBottom + paddingTop + paddingBottom
  }

  const contentWrapper = currentSlide.querySelector('.content-wrapper') as HTMLElement
  const content = currentSlide.querySelector('.content') as HTMLElement

  if (!contentWrapper || !content) return

  const contentWrapperHeight = contentWrapper.offsetHeight
  let totalHeight = getTotalHeightOfChildren(content)

  // set minimum font size from where the image starts to get reduced as well
  // this is to prevent the font size to get too small and becomes hard to read
  const fontSizeToStartReducingImage = 12
  let fontSize = parseFloat(getComputedStyle(content).fontSize)

  while (totalHeight > contentWrapperHeight) {
    const scaleFactor = contentWrapperHeight / totalHeight
    fontSize = Math.floor(scaleFactor * fontSize)

    const wrapperElements = Array.from(content.children) as HTMLElement[]
    wrapperElements.forEach((wrapperElement) => {
      wrapperElement.style.fontSize = `${fontSize}px`
      const style = getComputedStyle(wrapperElement)
      const marginTop = Math.floor(parseFloat(style.marginTop) * scaleFactor)
      const marginBottom = Math.floor(parseFloat(style.marginBottom) * scaleFactor)
      wrapperElement.style.marginTop = `${marginTop}px`
      wrapperElement.style.marginBottom = `${marginBottom}px`
    })

    // reduce image size if font size gets smaller than minimum font size
    const images = content.querySelectorAll(
      '.image-container .image-wrapper img'
    ) as NodeListOf<HTMLImageElement>
    if (fontSize <= fontSizeToStartReducingImage && images.length > 0) {
      images.forEach((image) => {
        const currentWidth = image.offsetWidth
        const currentHeight = image.offsetHeight
        image.style.width = `${Math.floor(currentWidth * scaleFactor)}px`
        image.style.height = `${Math.floor(currentHeight * scaleFactor)}px`
      })
    }
    totalHeight = getTotalHeightOfChildren(content)
  }

  if (currentSlide.classList.contains('about-us')) {
    const content = currentSlide.querySelector('.content') as HTMLElement
    const infoSection = currentSlide.querySelector('.info-section') as HTMLElement
    const contentWidth = content.offsetWidth
    let infoSectionWidth = infoSection.scrollWidth
    while (infoSectionWidth > contentWidth) {
      const scaleFactor = contentWidth / infoSectionWidth
      fontSize = Math.floor(scaleFactor * fontSize)

      const infoBoxes = infoSection.querySelectorAll('.info-box') as NodeListOf<HTMLElement>
      infoBoxes.forEach((box) => {
        box.style.fontSize = `${fontSize}px`
        const style = getComputedStyle(box)
        const padding = parseFloat(style.padding) * scaleFactor
        box.style.padding = `${Math.max(2, Math.floor(padding))}px`
        box.style.margin = `${Math.max(2, Math.floor(parseFloat(style.margin) * scaleFactor))}px`
      })
      infoSectionWidth = infoSection.scrollWidth
    }
  }
}
function fitContent() {
  const images = slideContainer.value.querySelectorAll('img')
  if (!images) {
    return
  }
  let imagesLoaded = 0

  images.forEach((img) => {
    if (img.complete) {
      imagesLoaded++
    } else {
      img.addEventListener('load', () => {
        imagesLoaded++
        if (imagesLoaded === images.length) {
          adjustFontSize()
        }
      })
    }
  })

  if (images.length === 0) {
    adjustFontSize()
  }
}
function separateFrontmatterAndMarkdown() {
  const options = {}
  const rawMarkdown = unref(mdTextarea).value
  return awesoMd.parseFrontMatter(rawMarkdown, options)
}
function setFontColor() {
  const frontMatter = separateFrontmatterAndMarkdown()[1]
  const color = frontMatter.metadata.color
  slideContainer.value.querySelectorAll('.title p, h1').forEach((el) => {
    el.style.color = color
  })
  slideContainer.value.querySelectorAll('.about-us-text').forEach((el) => {
    el.style.backgroundColor = color
  })
  slideContainer.value.querySelectorAll('.info-box h3').forEach((el) => {
    el.style.color = color
  })
}
function applyTemplateIfNeeded() {
  const [markdown, frontMatter] = separateFrontmatterAndMarkdown()
  const hasSlideMetadata = frontMatter.metadata?.slide
  const hasHeadingSlide = markdown.match(headingSlideRegex)
  const hasTemplatePath = frontMatter.metadata?.templatePath
  loadTemplate = !!(hasSlideMetadata || hasHeadingSlide) && !hasTemplatePath
  if (loadTemplate) {
    presentationViewerRef.value.classList.add('md-template')
    setFontColor()
  }
  return loadTemplate
}
</script>

<style lang="scss">
.dark-mode {
  .reveal {
    color: var(--oc-color-text-default, var(--color-role-on-surface)) !important;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: var(--oc-color-text-default, var(--color-role-on-surface));
    }

    code {
      background-color: var(--code-bg-color-dark) !important;
    }

    pre {
      background-color: var(--pre-bg-color-dark) !important;

      code {
        background-color: inherit !important;
      }
    }
  }
}

#slideContainer {
  section {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    > * {
      margin-top: 0;
    }

    p:has(img) {
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;

      img {
        width: auto;
        height: auto;
      }
    }

    code {
      color: var(--code-color);
      background-color: var(--code-bg-color);
      padding: 0px 4px;
      border-radius: 0.5rem;
      font-size: 0.8em;
      text-shadow: none;
    }
  }

  li pre {
    margin: 0;
    width: 100%;
  }

  pre {
    background-color: var(--pre-bg-color);

    code {
      padding: 4px;
      color: inherit;
      font-size: inherit;
      background-color: inherit;
    }
  }
}
</style>
