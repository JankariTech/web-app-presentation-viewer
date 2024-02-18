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
import {onMounted} from 'vue'
import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.js'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.js'

import 'reveal.js/dist/reveal.css'
import 'reveal.js/plugin/highlight/monokai.css'
import 'reveal.js/dist/theme/white.css'

const dataSeparator = '\r?\n---\r?\n'
const dataSeparatorVertical = '\r?\n--\r?\n'

defineProps({
  url: {
    type: String,
    required: true
  },
})

onMounted(() => {
  const reveal = new Reveal({
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

<style scoped lang="scss">

</style>
