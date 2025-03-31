# Markdown Presentation Viewer for ownCloud Web

![cover photo](./images/cover-large.png)

A markdown presentation viewer for [OpenCloud](https://github.com/opencloud-eu/opencloud/) and [oCIS](https://github.com/owncloud/ocis/) using the [reveal.js](https://revealjs.com/) library.

It allows users to:

- create slide presentations directly from markdown files
- share the slides using public links

## Demonstration

- [Demonstation page oCIS](https://ocis.in-nepal.de/com.github.jankaritech.mdpresentation-viewer/public/phDIUqntYOMSfcE/presentation.md)
- Click on `Open in Presentation Viewer` to view the slides

## Supported oCIS and Web Versions

- [oCIS](https://github.com/owncloud/ocis) (>= 6.x.x) or [OpenCloud](https://github.com/opencloud-eu/opencloud/) (>= 2.0.0)

## App Installation

1. Download the zip file from the [releases page](https://github.com/JankariTech/web-app-presentation-viewer/releases)

   For example: `mdpresentation-viewer-<architecture>-x.x.x.zip`

2. Extract the zip file to the `apps` directory of the OpenCloud/oCIS server.

   Apps directory is set using the `WEB_ASSET_APPS_PATH` environment variable.

### App Installation With [OpenCloud](https://github.com/opencloud-eu/opencloud/tree/main/deployments/examples/opencloud_full) or [oCIS Deployment](https://github.com/owncloud/ocis/tree/master/deployments/examples/ocis_full)

1. Copy [`deployments/mdpresentation-viewer.yml`](./deployments/mdpresentation-viewer.yml) into the `web_extensions`
subfolder.
2. Add `MDPRESENTATION_VIEWER=:web_extensions/mdpresentation-viewer.yml` to the `Web Extensions` section of the `.env` file of your installation and append it to the `COMPOSE_FILE` variable.
    ```env
    ## oCIS Web Extensions ##
    MDPRESENTATION_VIEWER=:web_extensions/mdpresentation-viewer.yml
    
    COMPOSE_FILE=docker-compose.yml${...}${MDPRESENTATION_VIEWER:-}
    ```
3. Run `docker compose up` to run the system with the extensions

## Creating Presentation

Please, refer to the [documentation](https://revealjs.com/markdown/) for more information about creating a presentation using markdown.

This app has the following default slide separators:

- Horizontal separator: `---` (`← →`)
- Vertical separator: `--` (`↓ ↑`)

## Development

> [!IMPORTANT] When switching between OpenCloud and oCIS, make sure to clean the browser cache!
> [!CAUTION] Before commiting changes run `make installOcis`

#### Prerequisites

- [Node.js `v18`](https://nodejs.org/en/)
- [pnpm `v8`](https://pnpm.io/)
- [Docker Compose](https://docs.docker.com/compose/)
- [jq](https://jqlang.org/)

#### 1. Install dependencies:

For OpenCloud:
```bash
make installOpencloud
```

For oCIS:
```bash
make installOcis
```

#### 2. Build the extension

For development, build with watch.

```bash
pnpm build:w
```

#### 3. Load the extension

Run the server with the extension:

For OpenCloud:
```bash
docker compose -f docker-compose-opencloud.yml up
```

For oCIS:
```bash
docker compose -f docker-compose-ocis.yml up
```

server URL: [localhost:9200](https://localhost:9200)
