<template>
  <div
    id="presentation-viewer-main"
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
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight'

import 'reveal.js/dist/reveal.css'
import 'reveal.js/plugin/highlight/monokai.css'
import 'reveal.js/dist/theme/white.css'

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

const dataSeparator = '\r?\n---\r?\n'
const dataSeparatorVertical = '\r?\n--\r?\n'
const mdImageRegex = /!\[.*\]\((?!(?:http|data))(.*)\)/g

let reveal: Reveal.Api

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
      for (let line of data.split('\n')) {
        const matches = line.matchAll(mdImageRegex)
        for (const match of matches) {
          const imgPath = match[1]
          const imageUrl = await updateImageUrls(imgPath)
          line = line.replace(`(${imgPath})`, `(${imageUrl})`)
        }
        parsedData.push(line)
      }
      unref(mdTextarea).textContent = parsedData.join('\n')
    })

  reveal = new Reveal(unref(revealContainer), {
    plugins: [RevealMarkdown, RevealHighlight]
  })

  await reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    controlsLayout: 'edges'
  })

  isReadyToShow.value = true
})
onBeforeUnmount(() => {
  unref(mediaUrls).forEach((url) => {
    revokeUrl(url)
  })
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
</script>

<style lang="scss">
.dark-mode {
  .reveal {
    color: var(--oc-color-text-default) !important;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: var(--oc-color-text-default) !important;
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
  }
}
</style>
