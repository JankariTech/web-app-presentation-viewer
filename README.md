# Markdown Presentation Viewer for ownCloud Web

A markdown presentation viewer for [ownCloud web](https://github.com/owncloud/web/) (the webUI of [oCIS](https://github.com/owncloud/ocis/)) using the [reveal.js](https://revealjs.com/) library.

It allows users to:

- create slide presentations directly from markdown files
- share the slides using public links

## Demonstration

- [Demonstation page](https://ocis.in-nepal.de/files/link/public/bdSEsErbfGKoOIt?fileId=bdSEsErbfGKoOIt&files-public-link-view-mode=resource-table)
- Click on `Open in Text Editor` to view the markdown content.
- Click on `Open in Presentation Viewer` to view the rendered presentation.

## Prerequisites

- [oCIS](https://github.com/owncloud/ocis) (>= 5.0.0)
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

Install dependencies:

```bash
pnpm install
```

Build the extension. For development, build with watch.

```bash
pnpm build:w
```

Depending on the oCIS version, we have two ways to load the apps into the oCIS server.

### 1. Separate Extension Server (oCIS 5.0.0)

With oCIS 5.0.0, it is only possible to load the external apps using the config file and app server.

Run the following command to serve the oCIS and the extension servers:

```bash
docker compose up
```

Extension URL: [host.docker.internal:3000](https://host.docker.internal:3000)

oCIS URL: [host.docker.internal:9200](https://host.docker.internal:9200)

### 2. oCIS Apps Loading (oCIS >= 5.1)

Starting from oCIS 5.1.0 (not released yet), external apps can be loaded into the oCIS without config file and separate app server. We just use `WEB_ASSET_APPS_PATH`, an oCIS environment variable, while running oCIS server to set the directory where all the external apps are located.

Follow these steps:

1. Build the extension with the following command:

   ```bash
   APPS_LOADING=true pnpm build:w
   ```

2. Copy `docker-compose.override.example.yml` to `docker-compose.override.yml`
3. Run the oCIS server:

   ```bash
   docker compose up
   ```

   oCIS URL: [host.docker.internal:9200](https://host.docker.internal:9200)
