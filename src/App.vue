<template>
  <div
    id="presentation-viewer-main"
    class="presentation-viewer oc-flex"
    :class="{ 'dark-mode': isDarkMode }"
  >
    <div class="reveal">
      <div ref="slideContainer" class="slides">
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
import { onMounted, ref, unref, watch } from 'vue'
import {
  useThemeStore,
  useAppDefaults,
  useAppFileHandling,
  useClientService
} from '@ownclouders/web-pkg'
import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight'

import 'reveal.js/dist/reveal.css'
import 'reveal.js/plugin/highlight/monokai.css'
import 'reveal.js/dist/theme/white.css'

import { id as appId } from '../public/manifest.json'

const themeStore = useThemeStore()
const { loadFolderForFileContext, currentFileContext, activeFiles } = useAppDefaults({
  applicationId: appId
})
const { getUrlForResource, revokeUrl } = useAppFileHandling({
  clientService: useClientService
})

const isDarkMode = ref(themeStore.currentTheme.isDark)
const slideContainer = ref<HTMLElement | undefined>()

const dataSeparator = '\r?\n---\r?\n'
const dataSeparatorVertical = '\r?\n--\r?\n'
const images = {}

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

onMounted(async () => {
  await loadFolderForFileContext(unref(currentFileContext))
  await parseImagesUrl()

  reveal = new Reveal({
    plugins: [RevealMarkdown, RevealHighlight]
  })

  reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    controlsLayout: 'edges'
  })

  reveal.on('ready', () => {
    const imgElements = unref(slideContainer).getElementsByTagName('img')
    updateImageUrls(imgElements)
  })
})

// METHODS
function updateImageUrls(imgElements: HTMLCollectionOf<HTMLImageElement>) {
  for (const el of imgElements) {
    const src = el.src.split('/').pop()
    el.src = images[src]
  }
}
async function parseImagesUrl() {
  for (const file of unref(activeFiles)) {
    // TODO: use image mimetypes
    if (file.extension === 'png') {
      const url = await getUrlForResource(unref(currentFileContext).space, file)
      images[file.name] = await getBlobUrl(url)
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
</style>
