# Markdown Presentation Viewer for ownCloud Web

A markdown presentation viewer for [ownCloud web](https://github.com/owncloud/web/) (the webUI of [oCIS](https://github.com/owncloud/ocis/)) using the [reveal.js](https://revealjs.com/) library.

It allows users to:

- create slide presentations directly from markdown files
- share the slides using public links

## Demonstration

- [Demonstation page](https://ocis.in-nepal.de/files/link/public/bdSEsErbfGKoOIt?fileId=bdSEsErbfGKoOIt&files-public-link-view-mode=resource-table)
- Click on `Open in Text Editor` to view the markdown content.
- Click on `Open in Presentation Viewer` to view the rendered presentation.

## Supported oCIS and Web Versions

- [oCIS](https://github.com/owncloud/ocis) (>= 5.1.x)
- [Web](https://nodejs.org/en/) (>= 9.x.x)

## App Installation

#### 1. Install Dependencies

```bash
pnpm install
```

#### 2. Build the extension

```bash
pnpm build
```

The extension will be built in the `dist` directory.

> NOTE: Requires oCIS >= 5.1 (not released yet)

External apps can be loaded into the oCIS without separate app server. We just have to use `WEB_ASSET_APPS_PATH`, an oCIS environment variable, while running oCIS server to set the directory where all the external apps are located.

For example:

```bash
...
WEB_ASSET_APPS_PATH=</path/to/dist> \
ocis server
```

## Development

#### Prerequisites

- [Node.js `v18`](https://nodejs.org/en/)
- [pnpm `v8`](https://pnpm.io/)
- [Docker Compose](https://docs.docker.com/compose/)

#### 1. Install dependencies:

```bash
pnpm install
```

#### 2. Build the extension

For development, build with watch.

```bash
pnpm build:w
```

#### 3. Load the extension

> NOTE: Requires oCIS >= 5.1 (not released yet)

Run the oCIS server:

```bash
docker compose up
```

oCIS URL: [localhost:9200](https://localhost:9200)
