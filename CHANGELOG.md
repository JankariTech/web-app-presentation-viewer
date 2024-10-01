# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Fixed

- SVG files cannot be used as images (https://github.com/JankariTech/web-app-presentation-viewer/issues/85)
- Trying to load an image from an not existing folder, breaks the presentation (https://github.com/JankariTech/web-app-presentation-viewer/issues/86)
- Single backtick is not recognizable as code block (https://github.com/JankariTech/web-app-presentation-viewer/pull/82)
- Code blocks in lists are not using existing space (https://github.com/JankariTech/web-app-presentation-viewer/pull/80)

### Changed

### Removed

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
