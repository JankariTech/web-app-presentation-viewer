# Markdown Presentation Viewer for ownCloud Web

![cover photo](./images/cover-large.png)

A markdown presentation viewer for [ownCloud web](https://github.com/owncloud/web/) (the webUI of [oCIS](https://github.com/owncloud/ocis/)) using the [reveal.js](https://revealjs.com/) library.

It allows users to:

- create slide presentations directly from markdown files
- share the slides using public links

## Demonstration

- [Demonstation page](https://ocis.in-nepal.de/com.github.jankaritech.mdpresentation-viewer/public/phDIUqntYOMSfcE/presentation.md)
- Click on `Open in Presentation Viewer` to view the slides

## Supported oCIS and Web Versions

- [oCIS](https://github.com/owncloud/ocis) (>= 6.x.x)
- [Web](https://nodejs.org/en/) (>= 9.x.x)

## App Installation

> NOTE: Requires oCIS >= 6.0.0

1. Download the zip file from the [releases page](https://github.com/JankariTech/web-app-presentation-viewer/releases)

   For example: `mdpresentation-viewer-x.x.x.zip`

2. Extract the zip file to the `apps` directory of the oCIS server.

   Apps directory is set using the `WEB_ASSET_APPS_PATH` environment variable.

### App Installation With [oCIS Deployment](https://github.com/owncloud/ocis/tree/master/deployments/examples/ocis_full)

1. Copy [`deployments/mdpresentation-viewer.yml`](./deployments/mdpresentation-viewer.yml) into the [web_extensions](https://github.com/owncloud/ocis/tree/master/deployments/examples/ocis_full/web_extensions)
subfolder of oCIS full deployment example.
2. Add `MDPRESENTATION_VIEWER=:web_extensions/mdpresentation-viewer.yml` to the `## oCIS Web Extensions ##` section of the `.env` file of your installation (file is located in `deployments/examples/ocis_full`) and append it to the `COMPOSE_FILE` variable.
    ```env
    ## oCIS Web Extensions ##
    MDPRESENTATION_VIEWER=:web_extensions/mdpresentation-viewer.yml
    
    COMPOSE_FILE=docker-compose.yml${...}${MDPRESENTATION_VIEWER:-}
    ```
3. Run `docker compose up` to run oCIS with the extensions

  oCIS URL: [ocis.owncloud.test](https://ocis.owncloud.test)
  See the [docs](https://github.com/owncloud/ocis/tree/master/deployments/examples/ocis_full).

## Creating Presentation

Please, refer to the [documentation](https://revealjs.com/markdown/) for more information about creating a presentation using markdown.

This app has the following default slide separators:

- Horizontal separator: `---` (`← →`)
- Vertical separator: `--` (`↓ ↑`)

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

> NOTE: Requires oCIS >= 6.0.0

Run the oCIS server:

```bash
docker compose up
```

oCIS URL: [localhost:9200](https://localhost:9200)
