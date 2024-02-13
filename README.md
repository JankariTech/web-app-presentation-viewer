# Markdown Presentation Viewer for Owncloud Web

A markdown presentation viewer for the [Owncloud web](https://owncloud.com/features/web-app/) using the [reveal.js](https://revealjs.com/) library.
It is an extension for the Owncloud web app that allows users to view markdown files as presentations.

## Prerequisites
- [Node.js](https://nodejs.org/en/) (v18.17.1)
- [pnpm](https://pnpm.io/) (v8.15.1)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Project Setup
### 1. Install Dependencies
```bash
pnpm install
```

### 2. Build the extension
```bash
pnpm build
```
The extension will be built in the `dist` directory.

For development, build with watch
```bash
pnpm build:w
```
The extension will be served at [http://localhost:8082/js/web-app-presentation-viewer.js](http://localhost:8082/js/web-app-presentation-viewer.js)

### 3. Start the extension and the web services
```bash
docker compose up
```

The web can be accessed at [https://host.docker.internal:9200](https://host.docker.internal:9200)
