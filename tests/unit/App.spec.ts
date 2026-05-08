import { shallowMount, flushPromises } from '@vue/test-utils'
import App from '../../src/App.vue'

const defaultActiveFiles = [
  { name: 'cool.svg', path: '/cool.svg', mimeType: 'image/svg+xml' },
  { name: 'cool.png', path: '/cool.png', mimeType: 'image/png' },
  { name: 'sub', path: '/sub' }
]

const defaultWebdavChildren = [
  { name: 'another-cool.jpg', path: '/another-cool.jpg', mimeType: 'image/jpeg' }
]

let mockCurrentFileContext = {}
let mockActiveFiles = defaultActiveFiles
let mockWebdavChildren = defaultWebdavChildren
let mockGetUrlForResource = vi.fn()
let mockRevokeUrl = vi.fn()
let mockServerUrl = 'https://localhost:9200'

const templateHtmlMap: Record<string, string> = {
  'cover-template.html': `<script type="x-tmpl-mustache">
<div class="content-container">
<div class="logo">
<img src="{{{ metadata.logo }}}" alt="Logo">
</div>

<div class="content">
<h1>{{{ title }}}</h1>

<p>
By: {{{ metadata.presenter }}}
</p>

</div>
</div>
</script>
`,

  'title-content-template.html': `<script type="x-tmpl-mustache">
<div class="content-container">
<div class="title">
<h1>

{{{ title }}}

</h1>
<div class="logo">
<img src="{{{ metadata.logo }}}" alt="Logo">
</div>
</div>

<div class="content-wrapper">
<div class="content">

{{{ content }}}

</div>
</div>
</div>
<footer>
<div class="footer-content">{{{ metadata.footer }}}</div>
<div class="custom-slide-number"></div>
</footer>
</script>
`,

  'title-content-image-template.html': `<script type="x-tmpl-mustache">
<div class="content-container">
<div class="title">
<h1>

{{{ title }}}

</h1>
<div class="logo">
<img src="{{{ metadata.logo }}}" alt="Logo">
</div>
</div>

<div class="content-wrapper">
<div class="content">

{{{ content }}}

</div>
</div>
</div>
<footer>
<div class="footer-content">{{{ metadata.footer }}}</div>
<div class="custom-slide-number"></div>
</footer>
</script>
`,

  'about-us-template.html': `<script type="x-tmpl-mustache">
<div class="content-container">
<div class="title">
<h1>

{{{ title }}}

</h1>
<div class="logo">
<img src="{{{ metadata.logo }}}" alt="Logo">
</div>
</div>

<div class="content-wrapper">
<div class="content">
<div class="about-us-text">

{{{ content }}}

</div>
<div class="info-section">

{{#metadata.aboutUs}}
<div class="info-box">
<h3>{{ title }}</h3>
<p>{{ text }}</p>
</div>
<div class="divider"></div>
{{/metadata.aboutUs}}

</div>

</div>
</div>
</div>
<footer>
<div class="footer-content">{{{ metadata.footer }}}</div>
<div class="custom-slide-number"></div>
</footer>
</script>
`
}

const createFetchMock = (markdownContent: string) => {
  return vi.fn().mockImplementation((url: unknown) => {
    if (typeof url !== 'string') {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(''),
        blob: () => Promise.resolve(new Blob([], { type: 'image/png' }))
      })
    }

    if (url.includes('-template.html')) {
      const templateName = url.split('/').pop()
      const templateHtml = templateHtmlMap[templateName]
      if (templateHtml) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(templateHtml),
          blob: () => Promise.resolve(new Blob([templateHtml], { type: 'text/html' }))
        })
      }
      return Promise.resolve({
        ok: false,
        status: 404,
        text: () => Promise.resolve(''),
        blob: () => Promise.resolve(new Blob([]))
      })
    }

    return Promise.resolve({
      ok: true,
      text: () => Promise.resolve(markdownContent),
      blob: () => Promise.resolve(new Blob([], { type: 'text/markdown' }))
    })
  })
}

// mock modules
vi.mock('@ownclouders/web-pkg', () => ({
  useAppDefaults: vi.fn().mockImplementation(() => ({
    loadFolderForFileContext: vi.fn(),
    currentFileContext: mockCurrentFileContext,
    activeFiles: mockActiveFiles
  })),
  useAppFileHandling: vi.fn().mockImplementation(() => ({
    getUrlForResource: mockGetUrlForResource,
    revokeUrl: mockRevokeUrl
  })),
  useThemeStore: vi.fn().mockImplementation(() => ({
    currentTheme: { isDark: false }
  })),
  useClientService: vi.fn().mockImplementation(() => ({
    webdav: {
      listFiles: () => ({
        children: mockWebdavChildren
      })
    }
  })),
  useAppsStore: () => ({
    externalAppConfig: () => []
  }),
  useConfigStore: vi.fn().mockImplementation(() => ({
    serverUrl: mockServerUrl
  })),
  AppLoadingSpinner: vi.fn()
}))
// global mocks
const defaultFetchMock = createFetchMock(`### Slide 1
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
![cool](./cool.svg)

![cool](./cool.png)

![non-existing](./non-existing-image.png)

![sub-folder-image](./sub/another-cool.jpg)

![sub-folder-image](./non-existing/another-cool.jpg)
---

### Code block
\`\`\`
code block
\`\`\`
`)

global.fetch = defaultFetchMock
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

// eslint-disable-next-line require-await
describe('Template Features', async () => {
  beforeEach(() => {
    global.fetch = defaultFetchMock
  })

  it('should return template not found error message', async () => {
    global.fetch = createFetchMock(`---
slide: non-existent
---
`)
    const vm = getWrapper()
    await flushPromises()
    expect(vm.html()).toContain('Template for slide "non-existent" not found.')
  })

  it('should return sanitized error message', async () => {
    global.fetch = createFetchMock(`---
slide: title-content
presenter: John Doe
logo: https://external:9200/cat.jpg
---
# Reveal Js Templates in Web App Presentation Viewer ::slide:<a href="jankari.tech">jankaritech</a>
`)
    const vm = getWrapper()
    await flushPromises()
    expect(vm.html()).toContain(
      'Template for slide "<a href="jankari.tech">jankaritech</a>" not found. Status: 404'
    )
  })

  it('should return yaml parsing error', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    global.fetch = createFetchMock(`---
slide: title-content
logo: [invalid yaml
---
`)
    const vm = getWrapper()
    await flushPromises()
    expect(errorSpy).toHaveBeenCalled()
    expect(vm.html()).toContain(
      'YAMLException: unexpected end of the stream within a flow collection at line 3, column 1'
    )
  })

  it('should render cover template', async () => {
    global.fetch = createFetchMock(`---
slide: title-content
presenter: John Doe
logo: https://external:9200/cat.jpg
---
# Reveal Js Templates in Web App Presentation Viewer ::slide:cover
`)
    const vm = getWrapper()
    await flushPromises()
    await vi.waitFor(
      () => {
        expect(vm.classes('md-template')).toBe(true)
      },
      { timeout: 1000 }
    )
    expect(vm.find('.reveal .slides').html()).toMatchSnapshot()
  })

  it('should render title content template', async () => {
    global.fetch = createFetchMock(`---
slide: title-content
presenter: John Doe
logo: https://external:9200/cat.jpg
---
# Title Content Slide

- Introduction to mountain ecosystems
- Basic concepts of quantum encryption
- Exploring culinary traditions in Southeast Asia
- Overview of blockchain consensus mechanisms
- Setting up a personal productivity system
- Writing clean, maintainable JavaScript code
- Understanding modern art movements
- History of aviation and early flight experiments
- Managing team dynamics in remote work
`)
    const vm = getWrapper()
    await flushPromises()
    await vi.waitFor(
      () => {
        expect(vm.classes('md-template')).toBe(true)
      },
      { timeout: 1000 }
    )
    expect(vm.find('.reveal .slides').html()).toMatchSnapshot()
  })

  it('should render title content image template', async () => {
    global.fetch = createFetchMock(`---
slide: title-content
presenter: John Doe
logo: https://external:9200/cat.jpg
---
# Title Content Image Slide ::slide:title-content-image

- Introduction to mountain ecosystems
- Basic concepts of quantum encryption
- Exploring culinary traditions in Southeast Asia
- Overview of blockchain consensus mechanisms

![cat](https://external:9200/cat.jpg)
`)
    const vm = getWrapper()
    await flushPromises()
    await vi.waitFor(
      () => {
        expect(vm.classes('md-template')).toBe(true)
      },
      { timeout: 1000 }
    )
    expect(vm.find('.reveal .slides').html()).toMatchSnapshot()
  })

  it('should render about us template', async () => {
    global.fetch = createFetchMock(`---
slide: title-content
presenter: John Doe
logo: https://external:9200/cat.jpg
aboutUs:
  - title: WWW
    text: www.example.com
  - title: LINKEDIN
    text: www.linkedin.com/company/example
  - title: FACEBOOK
    text: www.facebook.com/example
  - title: X
    text: www.x.com/example
---
# About Us ::slide:about-us

Some content about us.
`)
    const vm = getWrapper()
    await flushPromises()
    await vi.waitFor(
      () => {
        expect(vm.classes('md-template')).toBe(true)
      },
      { timeout: 1000 }
    )
    expect(vm.find('.reveal .slides').html()).toMatchSnapshot()
  })
})

describe('Custom CSS loading', () => {
  beforeEach(() => {
    document.getElementById('reveal-custom-css')?.remove()
    global.fetch = defaultFetchMock
    mockCurrentFileContext = { space: 'space-id' }
    mockActiveFiles = [
      { name: 'templates', path: '/templates', mimeType: undefined },
      ...defaultActiveFiles
    ]
    mockWebdavChildren = [
      {
        name: 'title-content-template.html',
        path: '/templates/title-content-template.html',
        mimeType: 'text/html'
      },
      {
        name: 'custom.css',
        path: '/templates/custom.css',
        mimeType: 'text/css'
      }
    ]
  })

  afterEach(() => {
    document.getElementById('reveal-custom-css')?.remove()
    mockCurrentFileContext = {}
    mockActiveFiles = defaultActiveFiles
    mockWebdavChildren = defaultWebdavChildren
    mockGetUrlForResource = vi.fn()
    mockRevokeUrl = vi.fn()
    mockServerUrl = 'https://localhost:9200'
    global.fetch = defaultFetchMock
  })

  it('loads custom CSS when template is used', async () => {
    const getUrlForResourceMock = vi.fn().mockImplementation((space, file) => {
      return `https://auth.local${file.path}`
    })
    mockGetUrlForResource = getUrlForResourceMock

    const customCssBlobUrl = 'blob:nodedata:0295bafb-5976-468a-a263-685a8872cb96'

    global.fetch = vi.fn().mockImplementation((url: unknown) => {
      if (typeof url !== 'string') {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(''),
          blob: () => Promise.resolve(new Blob([], { type: 'image/png' }))
        })
      }

      if (url === 'https://localhost:9200/slides.md') {
        return Promise.resolve({
          ok: true,
          text: () =>
            Promise.resolve(`---
templatePath: templates
cssFile: custom.css
slide: title-content
presenter: John Doe
logo: https://external:9200/cat.jpg
---
# Slide title
`),
          blob: () => Promise.resolve(new Blob([], { type: 'text/markdown' }))
        })
      }

      if (url === 'https://auth.local/templates/title-content-template.html') {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(templateHtmlMap['title-content-template.html']),
          blob: () =>
            Promise.resolve(
              new Blob([templateHtmlMap['title-content-template.html']], { type: 'text/html' })
            )
        })
      }

      if (url === 'https://auth.local/templates/custom.css') {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('.slides section { color: rgb(255, 0, 0); }'),
          blob: () =>
            Promise.resolve(new Blob(['.slides section { color: red; }'], { type: 'text/css' }))
        })
      }

      if (url === customCssBlobUrl) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('.slides section { color: rgb(255, 0, 0); }'),
          blob: () => Promise.resolve(new Blob([], { type: 'text/css' }))
        })
      }

      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(''),
        blob: () => Promise.resolve(new Blob([], { type: 'application/octet-stream' }))
      })
    })

    getWrapper()
    await flushPromises()

    const customStyleTag = document.getElementById('reveal-custom-css')
    expect(customStyleTag).not.toBeNull()
    expect(customStyleTag?.textContent).toContain('color: rgb(255, 0, 0);')

    expect(getUrlForResourceMock).toHaveBeenCalledWith(
      'space-id',
      expect.objectContaining({ name: 'custom.css', path: '/templates/custom.css' })
    )
    expect(global.fetch).toHaveBeenCalledWith(customCssBlobUrl)
  })
})
