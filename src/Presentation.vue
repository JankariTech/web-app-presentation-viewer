<template>
  <div
    id="presentation-viewer-main"
    class="presentation-viewer oc-flex"
    :class="{ 'dark-mode': isDarkMode }"
  >
    <div class="reveal">
      <div class="slides" ref="slidesEl">
        <section
          :data-markdown="mdFileUrl"
          :data-separator="dataSeparator"
          :data-separator-vertical="dataSeparatorVertical"
        ></section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, unref, watch, nextTick } from 'vue'
import {
  useThemeStore,
  useAppDefaults,
  useAppFileHandling,
  useClientService,
} from '@ownclouders/web-pkg'
import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/plugin'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight'

import 'reveal.js/dist/reveal.css'
import 'reveal.js/plugin/highlight/monokai.css'
import 'reveal.js/dist/theme/white.css'

const { getUrlForResource, revokeUrl } = useAppFileHandling({
  clientService: useClientService,
})
const { currentFileContext, activeFiles } = useAppDefaults({
  applicationId: 'presentation-viewer', // TODO: import app id
})
const themeStore = useThemeStore()

const isDarkMode = ref(themeStore.currentTheme.isDark)
const mdFileUrl = ref('')
const slidesEl = ref<HTMLElement | undefined>()

const dataSeparator = '\r?\n---\r?\n'
const dataSeparatorVertical = '\r?\n--\r?\n'
let reveal: Reveal.Api

const images = {}

watch(
  () => themeStore.currentTheme.isDark,
  (isDark) => {
    isDarkMode.value = isDark
  }
)

onMounted(async () => {
  await imagesUrl()
  await setMdFileUrl()

  reveal = new Reveal({
    plugins: [RevealMarkdown, RevealHighlight],
  })
  reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    controlsLayout: 'edges',
  })

  reveal.on('ready', () => {
    const imgElements = unref(slidesEl).getElementsByTagName('img')
    updateImageUrls(imgElements)
  })
})

function updateImageUrls(imgElements: HTMLCollectionOf<HTMLImageElement>) {
  for (const el of imgElements) {
    const src = el.src.split('/').pop()
    el.src = images[src]
  }
}

async function setMdFileUrl() {
  const url = await getMdFileUrl()
  mdFileUrl.value = url
}

async function getMdFileUrl() {
  for (const file of unref(activeFiles)) {
    if (file.path === unref(currentFileContext).item) {
      return getUrlForResource(unref(currentFileContext).space, file)
    }
  }
}

async function imagesUrl() {
  for (const file of unref(activeFiles)) {
    // TODO: use image mimetypes
    if (file.extension === 'png') {
      const url = await getUrlForResource(unref(currentFileContext).space, file)
      images[file.name] = await getBlobUrl(url)
    }
  }
}
async function getBlobUrl(url) {
  const res = await fetch(url)
  const data = await res.blob()
  const blob = new Blob([data], { type: data.type })
  return URL.createObjectURL(blob)
}

function getImgBaseUrl() {
  const davUrl = unref(currentFileContext).space.root.webDavUrl
  let thisFolder = unref(currentFileContext).item.split('/')
  thisFolder.pop() // remove filename
  thisFolder = thisFolder.join('/') + '/'

  return `${davUrl}${thisFolder}`
}

// {
//     "path": "/spaces/102eb34b-6129-4c53-8324-71f73ff5e70f$52e3f074-215e-4bca-9183-efaf5d64cf19/pp/pp.md",
//     "driveAliasAndItem": "personal/admin/pp/pp.md",
//     "space": {
//         "id": "102eb34b-6129-4c53-8324-71f73ff5e70f$52e3f074-215e-4bca-9183-efaf5d64cf19",
//         "fileId": "102eb34b-6129-4c53-8324-71f73ff5e70f$52e3f074-215e-4bca-9183-efaf5d64cf19",
//         "storageId": "102eb34b-6129-4c53-8324-71f73ff5e70f$52e3f074-215e-4bca-9183-efaf5d64cf19",
//         "mimeType": "",
//         "name": "Personal",
//         "extension": "",
//         "path": "/",
//         "webDavPath": "/spaces/102eb34b-6129-4c53-8324-71f73ff5e70f$52e3f074-215e-4bca-9183-efaf5d64cf19",
//         "webDavTrashPath": "/spaces/trash-bin/102eb34b-6129-4c53-8324-71f73ff5e70f$52e3f074-215e-4bca-9183-efaf5d64cf19",
//         "driveAlias": "personal/admin",
//         "driveType": "personal",
//         "type": "space",
//         "isFolder": true,
//         "mdate": "2024-02-29T10:01:16.74369641Z",
//         "size": 145,
//         "indicators": [],
//         "tags": [],
//         "permissions": "",
//         "starred": false,
//         "etag": "",
//         "shareTypes": [],
//         "privateLink": "",
//         "downloadURL": "",
//         "owner": {
//             "displayName": "",
//             "id": "52e3f074-215e-4bca-9183-efaf5d64cf19"
//         },
//         "disabled": false,
//         "root": {
//             "eTag": "\"d3c4f1283601c269201536ca07c40fda\"",
//             "id": "102eb34b-6129-4c53-8324-71f73ff5e70f$52e3f074-215e-4bca-9183-efaf5d64cf19",
//             "webDavUrl": "https://host.docker.internal:9200/dav/spaces/102eb34b-6129-4c53-8324-71f73ff5e70f$52e3f074-215e-4bca-9183-efaf5d64cf19"
//         },
//         "spaceQuota": {
//             "remaining": 698310443008,
//             "state": "normal",
//             "total": 0,
//             "used": 145
//         },
//         "spaceRoles": {
//             "viewer": [],
//             "editor": [],
//             "manager": []
//         }
//     },
//     "item": "/pp/pp.md",
//     "itemId": "102eb34b-6129-4c53-8324-71f73ff5e70f$52e3f074-215e-4bca-9183-efaf5d64cf19!69b784cc-b903-4c5d-ba13-dcbd7e2b60a8",
//     "fileName": "pp.md",
//     "routeName": "files-spaces-generic",
//     "routeParams": {
//         "driveAliasAndItem": "personal/admin/pp"
//     },
//     "routeQuery": {
//         "fileId": "102eb34b-6129-4c53-8324-71f73ff5e70f$52e3f074-215e-4bca-9183-efaf5d64cf19!63d167f8-79b8-4827-855e-db990d604ffc",
//         "sort-by": "name",
//         "sort-dir": "asc"
//     }
// }
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
