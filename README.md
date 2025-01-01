# PteroLink

A Node.js library for interacting with the Pterodactyl Panel API.

## Installation

```bash
npm install pterolink
```

## Getting Started

### Communicating with the Application API

```js
const { ApplicationClient } = require("pterolink");

const client = new ApplicationClient({
  url: "https://your-pterodactyl-panel.com",
  apiKey: "your-api-key", // Application API Key (from Admin Control Panel)
});
```

### Communicating with the Client API

```js
const { UserClient } = require("pterolink");

const client = new UserClient({
  url: "https://your-pterodactyl-panel.com",
  apiKey: "your-api-key", // User-Specific API Key
});
```

## Contributing

If you want to contribute to this project, please feel free to submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
