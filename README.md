# PteroLink

A Node.js library for interacting with the Pterodactyl Panel API.

## Installation

```bash
npm install pterolink
```

## Usage

```javascript
// for intereacting with the application api
const { ApplicationClient } = require("pterolink");

const client = new ApplicationClient({
  url: "https://your-pterodactyl-panel.com",
  apiKey: "your-api-key", // application api key
});
```

```javascript
// interacting with user api
const { UserClient } = require("pterolink");

const client = new UserClient({
  url: "https://your-pterodactyl-panel.com",
  apiKey: "your-api-key", // user api key
});
```
