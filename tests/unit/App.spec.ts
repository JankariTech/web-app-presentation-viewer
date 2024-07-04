import { shallowMount, flushPromises } from '@vue/test-utils'
import App from '../../src/App.vue'

vi.mock('@ownclouders/web-pkg', () => ({
  useAppDefaults: vi.fn().mockImplementation(() => ({
    loadFolderForFileContext: vi.fn(),
    currentFileContext: {},
    activeFiles: []
  })),
  useAppFileHandling: vi.fn().mockImplementation(() => ({
    getUrlForResource: vi.fn(),
    revokeUrl: vi.fn()
  })),
  useThemeStore: vi.fn().mockImplementation(() => ({
    currentTheme: { isDark: false }
  })),
  useClientService: vi.fn(),
  useAppsStore: vi.fn(),
  useConfigStore: vi.fn().mockImplementation(() => ({
    serverUrl: 'https://localhost:9200'
  }))
}))
// vi.mock('reveal.js', async (importOriginal) => {
//   const actual = await importOriginal()
//   return {
//     ...actual,
//     initialize: vi.fn()
//   }
// })

describe('App component', () => {
  it('mount component', async () => {
    const vm = getWrapper()
    await flushPromises()
    console.log(vm.html())
    // expect(vm.html()).toMatchSnapshot()
  })
})

function getWrapper() {
  const blobUrl = URL.createObjectURL(new Blob(['## Slide 1']))
  return shallowMount(App, {
    propsData: { url: blobUrl }
  })
}
