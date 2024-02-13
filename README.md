# Markdown Presentation Viewer for Owncloud Web

A markdown presentation viewer for the [Owncloud web](https://owncloud.com/features/web-app/) using the [reveal.js](https://revealjs.com/) library.
It is an extension for the Owncloud web that allows users to create slide presentations directly from markdown files.

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
2. edit `web.config.json` and set `<your-ocis-domain>` & `<url-where-the-dist-folder-is-served>` to the correct values
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
