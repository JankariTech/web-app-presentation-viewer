# Markdown Presentation Viewer for OpenCloud & ownCloud (oCIS)

![cover photo](./images/cover-large.png)

A markdown presentation viewer for [OpenCloud](https://github.com/opencloud-eu/opencloud/) and [oCIS](https://github.com/owncloud/ocis/) using the [reveal.js](https://revealjs.com/) library.

It allows users to:

- create slide presentations directly from markdown files
- share the slides using public links

## Demonstration

- [Demonstation page OpenCloud](https://opencloud.in-nepal.de/files/link/public/PHxkrAlpSRaqNNK)
- [Demonstation page oCIS](https://ocis.in-nepal.de/files/link/public/phDIUqntYOMSfcE)
- Click on `Open in Presentation Viewer` to view the slides

## Supported oCIS and Web Versions

- [oCIS](https://github.com/owncloud/ocis) (>= 6.x.x) or [OpenCloud](https://github.com/opencloud-eu/opencloud/) (>= 2.0.0)

## App Installation

1. Download the zip file from the [releases page](https://github.com/JankariTech/web-app-presentation-viewer/releases)

   For example: `mdpresentation-viewer-<server>-x.x.x.zip`

2. Extract the zip file to the `apps` directory of the OpenCloud/oCIS server.

   Apps directory is set using the `WEB_ASSET_APPS_PATH` environment variable.

### App Installation With [OpenCloud](https://github.com/opencloud-eu/opencloud/tree/main/deployments/examples/opencloud_full) or [oCIS Deployment](https://github.com/owncloud/ocis/tree/master/deployments/examples/ocis_full)

1. Copy the `yml` file that corresponds with your server (OpenCloud or oCIS) from [`deployments/`](./deployments/) into the `web_extensions`
subfolder.
2. Add `MDPRESENTATION_VIEWER=:web_extensions/mdpresentation-viewer-<your-server>.yml` to the `Web Extensions` section of the `.env` file of your installation and append it to the `COMPOSE_FILE` variable.
    ```env
    MDPRESENTATION_VIEWER=:web_extensions/mdpresentation-viewer-<your-server>.yml
    
    COMPOSE_FILE=docker-compose.yml${...}${MDPRESENTATION_VIEWER:-}
    ```
3. Run `docker compose up` to run the server with the extensions

## Creating Presentation

Please, refer to the [documentation](https://revealjs.com/markdown/) for more information about creating a presentation using markdown.

This app has the following default slide separators:

- Horizontal separator: `---` (`← →`)
- Vertical separator: `--` (`↓ ↑`)

## Using Templates

To use the templates in the presentation viewer, use the front matter to provide default metadata followed by slide
contents.

The front matter is used to define the default values for the presentation and will be applied to every slides. The
default metadata can be defined as below:

```markdown
---
slide: <default-slide-type>
presenter: <name-of-the-presenter>
logo: <path-to-logo>
color: <font-color-for-slide-title>
footer: <footer-content>
aboutUs: <content-for-about-us-slide>
---
```

These are the supported metadata required for the presentation template.

| Default Metadata | Description                                                                                                                                                |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `slide`          | Default slide for presentation. Most used slide template can be given in the default metadata.                                                             |
| `presenter`      | Name of the presenter.                                                                                                                                     |
| `logo`           | Logo of the company. Logo appears on the top right corner of the slide                                                                                     |
| `color`          | Font color of the slide title.                                                                                                                             |
| `footer`         | Content to be shown in the footer of the slide.                                                                                                            |
| `aboutUs`        | Column wise content to be shown in the about-us slide. Use this metadata only if about-us slide is used for the presentation. More [here](#slide-about-us) |

Following the front matter, create slides as described in [Creating Presentation](#creating-presentation)

Besides default metadata, you can also provide inline metadata for each slide. This will be useful when you want to
override the default metadata for a specific slide and this will be applied to that slide only. The inline metadata can
be defined by adding metadata directly after the slide title as below:

```markdown
# Title of the slide ::metadata_key_1:metadata_value_1 ::metadata_key_2:metadata_value_2
```

### Slide Templates

The slide template should be provided in the default metadata. Provide slide template that will be mostly used in the
default metadata, so you don't need to add the slide metadata in every slide.

| Slide Template        | Desctiption                                                     | Usage                         |
|-----------------------|-----------------------------------------------------------------|-------------------------------|
| `cover`               | This slide template can be used for cover slide                 | `::slide:cover`               |
| `title-content`       | The slide with title and content (content can be image as well) | `::slide:title-content`       |
| `title-content-image` | The slide with title, and content in left and image in right    | `::slide:title-content-image` |
| `about-us`            | The slide with company info (e.g., Values, mission, Vision)     | `::slide:about-us`            |

#### Slide "Cover"

Preview:

```text
┌────────────────────────────────────────────────────┐
│                                                    │
│                                                    │
│                      LOGO                          │
│                      TITLE                         │
│                   PRESENTER NAME                   │
│                                                    │
│                                                    │
├────────────────────────────────────────────────────┤
│                                              LOGO  │
└────────────────────────────────────────────────────┘
```

Code:

```markdown
# TITLE ::slide:cover
```

#### Slide "title-content"

Preview:

```text
┌────────────────────────────────────────────────────┐
│ TITLE                                        LOGO  │
├────────────────────────────────────────────────────┤
│                                                    │
│                                                    │
│ CONTENT                                            │
│                                                    │
│                                                    │
├────────────────────────────────────────────────────┤
│  FOOTER                                     PAGENR │
└────────────────────────────────────────────────────┘
```

Code:

```markdown
# TITLE ::slide:title-content

CONTENT
```

Image can also be included in the content of the slide.

Preview:

```text
┌────────────────────────────────────────────────────┐
│ TITLE                                        LOGO  │
├────────────────────────────────────────────────────┤
│ CONTENT                                            │
├────────────────────────────────────────────────────┤
│                                                    │
│                       IMAGE                        │
│                                                    │
├────────────────────────────────────────────────────┤
│  FOOTER                                    PAGENR  │
└────────────────────────────────────────────────────┘
```

Code:

```markdown
# TITLE ::slide:title-image

CONTENT

![This is image description](./image.png)
```

#### Slide "title-content-image"

Preview:

```text
┌────────────────────────────────────────────────────┐
│ TITLE                                         LOGO │
├──────────────────────────┬─────────────────────────┤
│                          │                         │
│                          │                         │
│  CONTENT                 │          IMAGE          │
│                          │                         │
│                          │                         │
├──────────────────────────┴─────────────────────────┤
│  FOOTER                                     PAGENR │
└────────────────────────────────────────────────────┘
```

Code:

```markdown
# TITLE ::slide:title-content-image

CONTENT

![This is image description](image.png)
```

#### Slide "about-us"

Preview:

```text
┌────────────────────────────────────────────────────┐
│ TITLE                                         LOGO │
├────────────────────────────────────────────────────┤
│                                                    │
│   ┌────────────────────────────────────────────┐   │
│   │                CONTENT                     │   │
│   └────────────────────────────────────────────┘   │
│   ┌────────┐    │    ┌────────┐   │   ┌────────┐   │
│   │ TITLE  │    │    │ TITLE  │   │   │ TITLE  │   │
│   │ TEXT   │    │    │ TEXT   │   │   │ TEXT   │   │
│   └────────┘    │    └────────┘   │   └────────┘   │
│                                                    │
├────────────────────────────────────────────────────┤
│  FOOTER                                    PAGENR  │
└────────────────────────────────────────────────────┘
```

Code:

```markdown
# TITLE ::slide:about-us

CONTENT
```

The `title` and `text` can be provided via default metadat in front matter as:

```markdown
---
aboutUs:
  - title: Title 1
    text: Some text under title 1
  - title: Title 2
    text: Some text under title 2
  - title: Title 3
    text: Some text under title 3
---
```

## Development

> [!IMPORTANT] When switching between OpenCloud and oCIS, make sure to clean the browser cache!
> [!CAUTION] Before commiting changes run `make installOcis` and `make clean`

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

### Running e2e tests:
For oCIS:
```bash
pnpm run test:e2e <path_to_feature_file>
```

For OpenCloud:
```bash
TARGET_SERVER=opencloud pnpm run test:e2e <path_to_feature_file>
```

## Building Docker Container

For OpenCloud:
```bash
docker build --build-arg server=Opencloud -t jankaritech/mdpresentation-viewer-opencloud:<version> .
```


For Ocis:
```bash
docker build --build-arg server=Ocis -t jankaritech/mdpresentation-viewer-ocis:<version> .
```
