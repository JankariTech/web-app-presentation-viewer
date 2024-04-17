<template>
  <div
    id="presentation-viewer-main"
    class="presentation-viewer oc-flex"
    :class="{ 'dark-mode': isDarkMode }"
  >
    <div class="reveal">
      <div ref="slideContainer" id="slideContainer" class="slides">
        <section
          :data-markdown="url"
          :data-separator="dataSeparator"
          :data-separator-vertical="dataSeparatorVertical"
        ></section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, unref, watch } from 'vue'
import {
  useThemeStore,
  useAppDefaults,
  useAppFileHandling,
  useClientService,
  useAppsStore,
  useConfigStore
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
const { loadFolderForFileContext, currentFileContext, activeFiles } = useAppDefaults({
  applicationId: appId
})
const { getUrlForResource, revokeUrl } = useAppFileHandling({
  clientService: useClientService
})
const appsStore = useAppsStore()
const { serverUrl } = useConfigStore()

const isDarkMode = ref(themeStore.currentTheme.isDark)
const slideContainer = ref<HTMLElement | undefined>()
const mediaUrls = ref([])

const mediaBasePath = `${serverUrl}local/`
const dataSeparator = '\r?\n---\r?\n'
const dataSeparatorVertical = '\r?\n--\r?\n'

let reveal: Reveal.Api

defineProps({
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

  reveal = new Reveal({
    plugins: [RevealMarkdown, RevealHighlight]
  })

  reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    controlsLayout: 'edges',
    markdown: {
      baseUrl: mediaBasePath
    }
  })

  reveal.on('ready', async () => {
    const imgElements = unref(slideContainer).getElementsByTagName('img')
    const localImgElements = filterLocalImgElements(imgElements)
    await updateImageUrls(localImgElements)
  })
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
    return unref(mediaMimeTypes).includes(file.mimeType?.toLowerCase())
  })
})

// METHODS
function filterLocalImgElements(
  imgElements: HTMLCollectionOf<HTMLImageElement>
): HTMLImageElement[] {
  const localImgElements: HTMLImageElement[] = []
  for (const el of imgElements) {
    if (el.src.startsWith(mediaBasePath)) {
      localImgElements.push(el)
    }
  }
  return localImgElements
}
async function updateImageUrls(localImgElements: HTMLImageElement[]) {
  for (const el of localImgElements) {
    const src = el.src.split('/').pop()
    const blobUrl = await parseImageUrl(src)
    el.src = blobUrl
    mediaUrls.value.push(blobUrl)
  }
}
async function parseImageUrl(name: string) {
  for (const file of unref(mediaFiles)) {
    if (file.name === name) {
      const url = await getUrlForResource(unref(currentFileContext).space, file)
      // reload the active files
      // TODO: implement caching
      await loadFolderForFileContext(unref(currentFileContext))
      return getBlobUrl(url)
    }
  }
}
async function getBlobUrl(url: string) {
  const data = await fetch(url).then(async (res) => await res.blob())
  const blob = new Blob([data], { type: data.type })
  return URL.createObjectURL(blob)
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
