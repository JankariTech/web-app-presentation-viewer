import { shallowMount, flushPromises } from '@vue/test-utils'
import App from '../../src/App.vue'

// mock modules
vi.mock('@ownclouders/web-pkg', () => ({
  useAppDefaults: vi.fn().mockImplementation(() => ({
    loadFolderForFileContext: vi.fn(),
    currentFileContext: {},
    activeFiles: [
      { name: 'cool.png', path: '/cool.png', mimeType: 'image/png' },
      { name: 'sub', path: '/sub' }
    ]
  })),
  useAppFileHandling: vi.fn().mockImplementation(() => ({
    getUrlForResource: vi.fn(),
    revokeUrl: vi.fn()
  })),
  useThemeStore: vi.fn().mockImplementation(() => ({
    currentTheme: { isDark: false }
  })),
  useClientService: vi.fn().mockImplementation(() => ({
    webdav: {
      listFiles: () => ({
        children: [{ name: 'another-cool.jpg', path: '/another-cool.jpg', mimeType: 'image/jpeg' }]
      })
    }
  })),
  useAppsStore: () => ({
    externalAppConfig: () => []
  }),
  useConfigStore: vi.fn().mockImplementation(() => ({
    serverUrl: 'https://localhost:9200'
  })),
  AppLoadingSpinner: vi.fn()
}))
// global mocks
global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    text: () =>
      Promise.resolve(`### Slide 1
Lorem **Bold** *Italic* ~strike through~

> Quote statement

* [ ] check box
- [ ] check box

---

### Slide 2
Unordered list:

* item 1
- item 2

Ordered list:

1. item 1
2. item 2

---

### External Image
![cat](https://external:9200/cat.jpg)

---

### Uploaded Image
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcIAAAHCCAYAAAB8GMlFAAAAAXNSR0IArs4c6QAAIABJREFUeF==)

---

### ocCIS Image
![cool](./cool.png)

![non-existing](./non-existing-image.png)

![sub-folder-image](./sub/another-cool.jpg)

![sub-folder-image](./non-existing/another-cool.jpg)
---

### Code block
\`\`\`
code block
\`\`\`
`),
    blob: () =>
      Promise.resolve(
        new Blob([JSON.stringify({})], {
          type: 'image/png'
        })
      )
  })
)
URL.createObjectURL = vi
  .fn()
  .mockImplementation(() => 'blob:nodedata:0295bafb-5976-468a-a263-685a8872cb96')

describe('App component', () => {
  it('render markdown slides', async () => {
    const vm = getWrapper()
    await flushPromises()
    expect(vm.html()).toMatchSnapshot()
  })
})

function getWrapper() {
  return shallowMount(App, {
    propsData: { url: 'https://localhost:9200/slides.md' }
  })
}
