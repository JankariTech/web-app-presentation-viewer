import { AppWrapperRoute, defineWebApplication } from '@ownclouders/web-pkg'
import App from './App.vue'
import { id as appId } from '../public/manifest.json'

export default defineWebApplication({
  setup() {
    const appInfo = {
      name: 'Presentation Viewer',
      id: appId,
      icon: 'resource-type-presentation',
      iconFillType: 'fill',
      iconColor: 'var(--oc-color-icon-presentation)',
      extensions: [
        {
          extension: 'md',
          label: 'Open in Presentation Viewer',
          routeName: appId,
          canBeDefault: true
        }
      ]
    }

    const routes = [
      {
        name: appId,
        path: '/:driveAliasAndItem(.*)?',
        component: AppWrapperRoute(App, {
          applicationId: appId,
          urlForResourceOptions: {
            disposition: 'inline'
          }
        }),
        meta: {
          authContext: 'hybrid',
          title: 'Presentation Viewer',
          patchCleanPath: true
        }
      }
    ]

    return {
      appInfo,
      routes
    }
  }
})
