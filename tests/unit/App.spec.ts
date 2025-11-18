import { shallowMount, flushPromises } from '@vue/test-utils'
import App from '../../src/App.vue'

// mock XMLHttpRequest for templates loading
global.XMLHttpRequest = class XMLHttpRequest {
  private responseText: string
  private status: number

  open(method, templatePath) {
    const templateName = templatePath.split('/').pop()

    switch (templateName) {
      case 'cover-template.html':
        this.status = 200
        this.responseText = `<script type="x-tmpl-mustache">
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
`
        break
      case 'title-content-template.html':
        this.status = 200
        this.responseText = `<script type="x-tmpl-mustache">
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
`
        break
      case 'title-content-image-template.html':
        this.status = 200
        this.responseText = `<script type="x-tmpl-mustache">
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
`
        break
      case 'about-us-template.html':
        this.status = 200
        this.responseText = `<script type="x-tmpl-mustache">
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
        break
      default:
        this.status = 404
        return '<p>Template for slide "' + templateName + '" not found.</p>'
    }
  }

  send() {
    return
  }
}

// mock modules
vi.mock('@ownclouders/web-pkg', () => ({
  useAppDefaults: vi.fn().mockImplementation(() => ({
    loadFolderForFileContext: vi.fn(),
    currentFileContext: {},
    activeFiles: [
      { name: 'cool.svg', path: '/cool.svg', mimeType: 'image/svg+xml' },
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
const defaultFetchMock = vi.fn().mockImplementation(() =>
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
`),
    blob: () =>
      Promise.resolve(
        new Blob([JSON.stringify({})], {
          type: 'image/png'
        })
      )
  })
)
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
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        text: () =>
          Promise.resolve(`---
slide: non-existent
---
`),
        blob: () => Promise.resolve(new Blob([], { type: 'text/markdown' }))
      })
    })
    const vm = getWrapper()
    await flushPromises()
    expect(vm.html()).toContain('Template for slide "non-existent" not found.')
  })

  it('should return yaml parsing error', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        text: () =>
          Promise.resolve(`---
slide: title-content
logo: [invalid yaml
---
`),
        blob: () => Promise.resolve(new Blob([], { type: 'text/markdown' }))
      })
    })

    const vm = getWrapper()
    await flushPromises()
    expect(errorSpy).toHaveBeenCalled()
    expect(vm.html()).toContain(
      'YAMLException: unexpected end of the stream within a flow collection at line 3, column 1'
    )
  })

  it('should render cover template', async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        text: () =>
          Promise.resolve(`---
slide: title-content
presenter: John Doe
logo: https://external:9200/cat.jpg
---
# Reveal Js Templates in Web App Presentation Viewer ::slide:cover
`),
        blob: () => Promise.resolve(new Blob([], { type: 'text/markdown' }))
      })
    })
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
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        text: () =>
          Promise.resolve(`---
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
`),
        blob: () => Promise.resolve(new Blob([], { type: 'text/markdown' }))
      })
    })
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
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        text: () =>
          Promise.resolve(`---
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
`),
        blob: () => Promise.resolve(new Blob([], { type: 'text/markdown' }))
      })
    })
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
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        text: () =>
          Promise.resolve(`---
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
`),
        blob: () => Promise.resolve(new Blob([], { type: 'text/markdown' }))
      })
    })
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
