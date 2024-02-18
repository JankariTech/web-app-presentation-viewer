<template>
  <div id="presentation-viewer-main" class="presentation-viewer oc-flex">
    <div class="reveal">
      <div class="slides">
        <section :data-markdown="url" :data-separator="dataSeparator"
                 :data-separator-vertical="dataSeparatorVertical"></section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, watch} from 'vue'

import {useThemeStore} from '@ownclouders/web-pkg'

import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.js'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.js'

import 'reveal.js/dist/reveal.css'
import 'reveal.js/plugin/highlight/monokai.css'
import 'reveal.js/dist/theme/white.css'
// import 'reveal.js/dist/theme/black.css'

const dataSeparator = '\r?\n---\r?\n'
const dataSeparatorVertical = '\r?\n--\r?\n'
const themeStore = useThemeStore()
const isDark = themeStore.currentTheme.isDark
let reveal: Reveal.Api

defineProps({
  url: {
    type: String,
    required: true
  },
})

watch(() => themeStore.currentTheme.isDark,
    async (isDark) => {
      reveal.configure({
        controls: isDark
      })
      loadTheme(isDark)
    }
)

onMounted(() => {
  reveal = new Reveal({
    plugins: [RevealMarkdown, RevealHighlight]
  });

  loadTheme(isDark)

  reveal.initialize({
    controls: isDark,
    progress: true,
    history: true,
    center: true,
    controlsLayout: 'edges',
  })
})

const loadTheme = (isDarkMode: boolean) => {
  const themePath = isDarkMode ? 'reveal.js/dist/theme/black.css' : 'reveal.js/dist/theme/white.css'

  const existingThemeLink = document.getElementById('reveal-theme-link')
  if (existingThemeLink) {
    existingThemeLink.remove()
  }

  const themeLink = document.createElement('link')
  themeLink.id = 'reveal-theme-link'
  themeLink.rel = 'stylesheet'
  themeLink.type = 'text/css'
  themeLink.href = themePath

  document.head.appendChild(themeLink)
}
</script>

<style scoped lang="scss">

</style>
