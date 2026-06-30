
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "@opencloud-eu/web-client": async () => {
          throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-client"}' must be provided by host`);
        }
      ,
        "@opencloud-eu/web-client/graph": async () => {
          throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-client/graph"}' must be provided by host`);
        }
      ,
        "@opencloud-eu/web-client/graph/generated": async () => {
          throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-client/graph/generated"}' must be provided by host`);
        }
      ,
        "@opencloud-eu/web-client/ocs": async () => {
          throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-client/ocs"}' must be provided by host`);
        }
      ,
        "@opencloud-eu/web-client/sse": async () => {
          throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-client/sse"}' must be provided by host`);
        }
      ,
        "@opencloud-eu/web-client/webdav": async () => {
          throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-client/webdav"}' must be provided by host`);
        }
      ,
        "@opencloud-eu/web-pkg": async () => {
          throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-pkg"}' must be provided by host`);
        }
      ,
        "@opencloud-eu/web-pkg/editor": async () => {
          throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-pkg/editor"}' must be provided by host`);
        }
      ,
        "luxon": async () => {
          throw new Error(`[Module Federation] Shared module '${"luxon"}' must be provided by host`);
        }
      ,
        "pinia": async () => {
          throw new Error(`[Module Federation] Shared module '${"pinia"}' must be provided by host`);
        }
      ,
        "vue": async () => {
          throw new Error(`[Module Federation] Shared module '${"vue"}' must be provided by host`);
        }
      ,
        "vue3-gettext": async () => {
          throw new Error(`[Module Federation] Shared module '${"vue3-gettext"}' must be provided by host`);
        }
      
    }
      const usedShared = {
      
          "@opencloud-eu/web-client": {
            name: "@opencloud-eu/web-client",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "mdpresentation-viewer",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-client"}' must be provided by host`);
              }
              usedShared["@opencloud-eu/web-client"].loaded = true
              const {"@opencloud-eu/web-client": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@opencloud-eu/web-client" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        ,
          "@opencloud-eu/web-client/graph": {
            name: "@opencloud-eu/web-client/graph",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "mdpresentation-viewer",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-client/graph"}' must be provided by host`);
              }
              usedShared["@opencloud-eu/web-client/graph"].loaded = true
              const {"@opencloud-eu/web-client/graph": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@opencloud-eu/web-client/graph" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        ,
          "@opencloud-eu/web-client/graph/generated": {
            name: "@opencloud-eu/web-client/graph/generated",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "mdpresentation-viewer",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-client/graph/generated"}' must be provided by host`);
              }
              usedShared["@opencloud-eu/web-client/graph/generated"].loaded = true
              const {"@opencloud-eu/web-client/graph/generated": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@opencloud-eu/web-client/graph/generated" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        ,
          "@opencloud-eu/web-client/ocs": {
            name: "@opencloud-eu/web-client/ocs",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "mdpresentation-viewer",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-client/ocs"}' must be provided by host`);
              }
              usedShared["@opencloud-eu/web-client/ocs"].loaded = true
              const {"@opencloud-eu/web-client/ocs": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@opencloud-eu/web-client/ocs" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        ,
          "@opencloud-eu/web-client/sse": {
            name: "@opencloud-eu/web-client/sse",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "mdpresentation-viewer",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-client/sse"}' must be provided by host`);
              }
              usedShared["@opencloud-eu/web-client/sse"].loaded = true
              const {"@opencloud-eu/web-client/sse": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@opencloud-eu/web-client/sse" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        ,
          "@opencloud-eu/web-client/webdav": {
            name: "@opencloud-eu/web-client/webdav",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "mdpresentation-viewer",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-client/webdav"}' must be provided by host`);
              }
              usedShared["@opencloud-eu/web-client/webdav"].loaded = true
              const {"@opencloud-eu/web-client/webdav": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@opencloud-eu/web-client/webdav" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        ,
          "@opencloud-eu/web-pkg": {
            name: "@opencloud-eu/web-pkg",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "mdpresentation-viewer",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-pkg"}' must be provided by host`);
              }
              usedShared["@opencloud-eu/web-pkg"].loaded = true
              const {"@opencloud-eu/web-pkg": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@opencloud-eu/web-pkg" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        ,
          "@opencloud-eu/web-pkg/editor": {
            name: "@opencloud-eu/web-pkg/editor",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "mdpresentation-viewer",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"@opencloud-eu/web-pkg/editor"}' must be provided by host`);
              }
              usedShared["@opencloud-eu/web-pkg/editor"].loaded = true
              const {"@opencloud-eu/web-pkg/editor": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@opencloud-eu/web-pkg/editor" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        ,
          "luxon": {
            name: "luxon",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "mdpresentation-viewer",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"luxon"}' must be provided by host`);
              }
              usedShared["luxon"].loaded = true
              const {"luxon": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "luxon" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        ,
          "pinia": {
            name: "pinia",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "mdpresentation-viewer",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"pinia"}' must be provided by host`);
              }
              usedShared["pinia"].loaded = true
              const {"pinia": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "pinia" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        ,
          "vue": {
            name: "vue",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "mdpresentation-viewer",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"vue"}' must be provided by host`);
              }
              usedShared["vue"].loaded = true
              const {"vue": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "vue" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        ,
          "vue3-gettext": {
            name: "vue3-gettext",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "mdpresentation-viewer",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"vue3-gettext"}' must be provided by host`);
              }
              usedShared["vue3-gettext"].loaded = true
              const {"vue3-gettext": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "vue3-gettext" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      