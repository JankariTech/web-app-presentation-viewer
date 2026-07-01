# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Fixed

## [3.0.0] - 2026-07-01

### Fixed
- update vite (https://github.com/JankariTech/web-app-presentation-viewer/pull/145)
- fix: add packages field to pnpm-workspace.yaml (https://github.com/JankariTech/web-app-presentation-viewer/pull/146)

## [2.3.0] - 2026-06-17

### Added
- feat: support for custom templates (https://github.com/JankariTech/web-app-presentation-viewer/pull/128)
- upgrade opencloud extension sdk (https://github.com/JankariTech/web-app-presentation-viewer/pull/134)
- move css file to public templates directory (https://github.com/JankariTech/web-app-presentation-viewer/pull/136)

### Fixed
- [Fix] ci: fix revealjs-awesoMD repo url (https://github.com/JankariTech/web-app-presentation-viewer/pull/122)
- [Fix] fix image size in title-content slide (https://github.com/JankariTech/web-app-presentation-viewer/pull/124)
- [Fix] fix: make logo optional (https://github.com/JankariTech/web-app-presentation-viewer/pull/130)
- [Fix] Fix full screen mode (https://github.com/JankariTech/web-app-presentation-viewer/pull/131)
- [Fix] fix: prevent metadata color from styling all h1 elements (https://github.com/JankariTech/web-app-presentation-viewer/pull/137)
- [Fix] fix: scaling content bug (https://github.com/JankariTech/web-app-presentation-viewer/pull/138)
- [Fix] fix: image position in title content image slide (https://github.com/JankariTech/web-app-presentation-viewer/pull/139)

## [2.2.1] - 2025-12-29

### Fixed

- [FIX] fix for text readability when dark mode enabled. (https://github.com/JankariTech/web-app-presentation-viewer/pull/117)

## [2.2.0] - 2025-11-24

### Added
- added possibility to show mermaid flow-charts (https://github.com/JankariTech/web-app-presentation-viewer/pull/105)
- Add templates for presentation viewer (https://github.com/JankariTech/web-app-presentation-viewer/pull/111)

## [2.1.0] - 2025-03-02

### Added
- support for OpenCloud

### Fixed

- fix: code blocks in lists are not using existing space (https://github.com/JankariTech/web-app-presentation-viewer/pull/80)
- fix: use separate color and bg color for single code block (https://github.com/JankariTech/web-app-presentation-viewer/pull/82)
- fix: trying to load an image from not existing folder, breaks the presentation (https://github.com/JankariTech/web-app-presentation-viewer/pull/88)
- fix: .svg files cannot be used as images (https://github.com/JankariTech/web-app-presentation-viewer/pull/89)

## [2.0.0] - 2024-08-30

### Added

- **Breaking:** Load ocis images from the sub directory level (https://github.com/JankariTech/web-app-presentation-viewer/pull/60)
- **Breaking:** Use ocis images from same directory level (https://github.com/JankariTech/web-app-presentation-viewer/pull/48)
- Loading spinner until presentation is ready (https://github.com/JankariTech/web-app-presentation-viewer/pull/61)

### Fixed

- Viewer stuck on loading if ocis images are not available (https://github.com/JankariTech/web-app-presentation-viewer/pull/75)

### Changed

- Renamed app-id to `mdpresentation-viewer` (https://github.com/JankariTech/web-app-presentation-viewer/pull/74)
- Parse and update local image urls directly in the markdown content (https://github.com/JankariTech/web-app-presentation-viewer/pull/61)

### Removed

## [1.0.0] - 2024-05-07

[1.0.0]: https://github.com/JankariTech/web-app-presentation-viewer/releases/tag/v1.0.0

**Supported oCIS-web versions:**

- web: `8.0.x`
- ocis: `5.0.x`

### Added

- Initial major release
