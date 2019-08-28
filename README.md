# @mousepox/static-server

A dead simple, zero-dependency static file server for [Node.js](https://nodejs.org/en/).

[![Actions Status](https://github.com/geoffb/mousepox-static-server/workflows/Build/badge.svg)](https://github.com/geoffb/mousepox-static-server/actions)

## Quick Start

```ts
import { StaticServer } from "@mousepox/static-server";

// Create server from a path to static resources
const server = new StaticServer("path/to/static/resources");

// Start listening
server.listen(8081);
```

## MIME Types

Content types are inferred from file extensions. By default, common extensions are mapped to their appropriate MIME types. For example, `.js` => `text/javascript`.

However, custom mappings can be set using the `setMIMEType` method:

```ts
server.setMIMEType(".xml", "application/xml");
```
