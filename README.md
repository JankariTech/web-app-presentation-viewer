# Markdown Presentation Viewer for Owncloud Web

A markdown presentation viewer for [Owncloud web](https://github.com/owncloud/web/) (the webUI of [oCIS](https://github.com/owncloud/ocis/)) using the [reveal.js](https://revealjs.com/) library.

It allows users to:
- create slide presentations directly from markdown files
- share the slides using public links

## Prerequisites
- [Node.js](https://nodejs.org/en/) (v18.17.1)
- [pnpm](https://pnpm.io/) (v8.15.1)
- [Docker](https://www.docker.com/)(optional)
- [Docker Compose](https://docs.docker.com/compose/)(optional)

## Installation
### 1. Install Dependencies
```bash
pnpm install
```

### 2. Build the extension
```bash
pnpm build
```
The extension will be built in the `dist` directory.

### 3. Serve the extension
1. serve the content of the `dist` folder using any HTTP web-server
2. configure web
   1. If you already have a dedicated `web.config.json` file, add an `external_apps` section (or edit the existing one). It has to have an item with `"id": "presentation-viewer"` and a `path` pointing to `web-app-presentation-viewer.js` e.g.:
      ```
      ...
      "external_apps": [
       {
         "id": "presentation-viewer",
         "path": "https://<url-where-the-dist-folder-is-served>/web-app-presentation-viewer.js"
       }
      ]
      ...
      ```
   2. if you haven't used a `web.config.json` file yet
      1. copy `config/web.config.json.sample` to the server that runs oCIS server
      2. rename it to `web.config.json`
      3. edit `web.config.json` and set `<your-ocis-domain>` & `<url-where-the-dist-folder-is-served>` to the correct values
3. start oCIS with the env. variable `WEB_UI_CONFIG_FILE` set to the full path of `web.config.json`

## Development

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Build the extension

For development, build with watch
```bash
pnpm build:w
```
The extension will be served at [http://localhost:8082/web-app-presentation-viewer.js](http://localhost:8082/web-app-presentation-viewer.js)

### 3. Start oCIS and the extension
```bash
docker compose up
```

The webUI of oCIS can be accessed at [https://host.docker.internal:9200](https://host.docker.internal:9200)
