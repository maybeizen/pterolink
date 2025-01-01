# PteroJS

A Node.js library for interacting with the Pterodactyl Panel API.

## Installation

```bash
npm install pterojs
```

## Usage

```javascript
// for intereacting with the application api
const { PteroClient } = require("pterojs");

const client = new PteroClient({
  url: "https://your-pterodactyl-panel.com",
  apiKey: "your-api-key", // application api key
});
```

// interacting with user api

```javascript
const { PteroUserClient } = require("pterojs");

const client = new PteroUserClient({
  url: "https://your-pterodactyl-panel.com",
  apiKey: "your-api-key", // user api key
});
```
