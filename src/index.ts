import { AppWrapperRoute, defineWebApplication } from "@ownclouders/web-pkg";
import App from "./Presentation.vue";

export default defineWebApplication({
  setup({ applicationConfig }) {
    const appId = "presentation-viewer";

    const appInfo = {
      name: "Presentation Viewer",
      id: appId,
      icon: "resource-type-presentation",
      iconFillType: "fill",
      iconColor: "var(--oc-color-icon-presentation)",
      extensions: [
        {
          extension: "md",
          label: "Open in Presentation Viewer",
          routeName: appId,
          canBeDefault: true,
        },
      ],
    };

    const routes = [
      {
        name: appId,
        path: "/:driveAliasAndItem(.*)?",
        component: App,
        meta: {
          authContext: "hybrid",
          title: "Presentation Viewer",
          patchCleanPath: true,
        },
      },
    ];

    return {
      appInfo,
      routes,
    };
  },
});
