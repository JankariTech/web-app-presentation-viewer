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
aboutUs:
    - title: <about-us-title1>
      text: <text-for-title1>
    - title: <about-us-title2>
      text: <text-for-title2>
    - title: <about-us-title3>
      text: <text-for-title3>
---
```

These are the supported metadata required for the presentation template.

| Default Metadata | Description                                                                                                                                                |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `slide`          | Default slide for presentation. Most used slide template can be given in the default metadata.                                                             |
| `presenter`      | Name of the presenter.                                                                                                                                     |
| `logo`           | Logo appears on the top right corner of the slide. The logo path should be relative to the markdown file.                                                  |
| `color`          | Font color of the slide title.                                                                                                                             |
| `footer`         | Content to be shown in the footer of the slide.                                                                                                            |
| `aboutUs`        | Column wise content to be shown in the about-us slide. Use this metadata only if about-us slide is used for the presentation. More [here](#slide-about-us) |
| `aboutUs:title`  | Title for each column in about-us slide.                                                                                                                   |
| `aboutUs:text`   | Text under each title for column in about-us slide.                                                                                                        |

Following the front matter, create slides as described in [Creating Presentation](#creating-presentation)

Besides default metadata, you can also provide inline metadata for each slide. This will be useful when you want to
override the default metadata for a specific slide and this will be applied to that slide only. The inline metadata can
be defined by adding metadata directly on the slide title as below:

```markdown
# Title of the slide ::metadata_key_1:metadata_value_1 ::metadata_key_2:metadata_value_2
```

Example:
```markdown
# Title of slide ::slide:title-content-image ::logo:logo.png
```

For this slide, the `slide` template will be set to `title-content-image`, and the `logo` will be set to `logo.png`.

### Slide Templates

The slide template should be provided in the default metadata. The slide type set in the default metadata will be used as the default. The mostly used slide template can be set as default. When you set a slide template in the default metadata, you don’t need to specify the slide type again in the inline metadata for slides that are already defined in the default metadata.

| Slide Template        | Desctiption                                                                       | Usage                         |
|-----------------------|-----------------------------------------------------------------------------------|-------------------------------|
| `cover`               | This slide template can be used for cover slide                                   | `::slide:cover`               |
| `title-content`       | A slide with a title and some content (the content can also be an image)          | `::slide:title-content`       |
| `title-content-image` | A slide with a title, and content on the left side and an image on the right side | `::slide:title-content-image` |
| `about-us`            | The slide with about-us info (e.g., Values, mission, Vision)                      | `::slide:about-us`            |

#### Slide "Cover"

Code:

```markdown
# TITLE ::slide:cover
```

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

#### Slide "title-content"

Code:

```markdown
# TITLE ::slide:title-content

CONTENT
```

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

Image can also be included in the content of the slide.

Code:

```markdown
# TITLE ::slide:title-content

CONTENT

![This is image description](./image.png)
```

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

#### Slide "title-content-image"

Code:

```markdown
# TITLE ::slide:title-content-image

CONTENT

![This is image description](image.png)
```

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

#### Slide "about-us"

Code:

```markdown
# TITLE ::slide:about-us

CONTENT
```

The `title` and `text` can be provided via default metadata in front matter as:

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
