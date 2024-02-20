<template>
  <div id="presentation-viewer-main" class="presentation-viewer oc-flex" :class="{'dark-mode': isDarkMode}">
    <div class="reveal">
      <div class="slides">
        <section :data-markdown="url" :data-separator="dataSeparator"
                 :data-separator-vertical="dataSeparatorVertical"></section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'

import {useThemeStore} from '@ownclouders/web-pkg'

import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.js'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.js'

import 'reveal.js/dist/reveal.css'
import 'reveal.js/plugin/highlight/monokai.css'
import 'reveal.js/dist/theme/white.css'

const dataSeparator = '\r?\n---\r?\n'
const dataSeparatorVertical = '\r?\n--\r?\n'
const themeStore = useThemeStore()
let isDarkMode = ref(themeStore.currentTheme.isDark)
let reveal: Reveal.Api

defineProps({
  url: {
    type: String,
    required: true
  },
})

watch(() => themeStore.currentTheme.isDark,
    (isDark) => {
      isDarkMode.value = isDark
    },
)

onMounted(() => {
  reveal = new Reveal({
    plugins: [RevealMarkdown, RevealHighlight]
  });

  reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    controlsLayout: 'edges',
  })
})
</script>

<style lang="scss">
.dark-mode {
  .reveal {
    color: var(--oc-color-text-default) !important;

    h1, h2, h3, h4, h5, h6 {
      color: var(--oc-color-text-default) !important;
    }
  }
}
</style>
