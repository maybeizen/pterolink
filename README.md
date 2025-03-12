<div align="center">
  
# 🦅 PteroLink

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/pterolink.svg)](https://www.npmjs.com/package/pterolink)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)

A modern, type-safe Node.js library for interacting with the Pterodactyl Panel API.
<br>
Simple, powerful, and user-friendly.

[Installation](#-installation) •
[Features](#-features) •
[Examples](#-examples) •
[Documentation](#-documentation) •
[Contributing](#-contributing)

</div>

> [!WARNING]
> PteroLink is currently in early development. APIs and functionality may change significantly between versions.

## 📦 Installation

```bash
# Using npm
npm install pterolink

# Using yarn
yarn add pterolink

# Using pnpm
pnpm add pterolink
```

## ✨ Features

- **🔒 Type Safety** - Built with TypeScript for better developer experience
- **⚡ Promise-Based** - All API calls return promises for easy async/await usage
- **🌐 Comprehensive** - Support for both Application and Client API
- **🛡️ Error Handling** - Detailed error types for better debugging
- **🚦 Rate Limiting** - Built-in protection against API rate limits
- **📚 Well Documented** - Clear examples and comprehensive documentation

## 🚀 Examples

<details open>
<summary><b>Creating an Application Client</b></summary>
<br>

```ts
import { PteroClient } from "pterolink";
import "dotenv/config";

const config = {
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
} as const;

const client = new PteroClient(config);
```

</details>

### 👤 User Management

<details>
<summary><b>List All Users</b></summary>
<br>

```ts
import { PteroClient } from "pterolink";
import "dotenv/config";

const config = {
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
} as const;

const client = new PteroClient(config);

client.users.list().then((users) => {
  console.log(users);
});
```

</details>

<details>
<summary><b>Creating Users</b></summary>
<br>

```ts
import { PteroClient } from "pterolink";
import "dotenv/config";

const config = {
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
} as const;

const client = new PteroClient(config);

client.users
  .create({
    email: "test@pterolink.dev",
    username: "test",
    first_name: "test",
    last_name: "test",
  })
  .then((user) => {
    console.log(user);
  });
```

</details>

<details>
<summary><b>User-Specific Operations</b></summary>
<br>

```ts
import { PteroClient } from "pterolink";
import "dotenv/config";

const config = {
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
} as const;

const client = new PteroClient(config);

// Get user by ID
client.user.get(1).then((user) => {
  console.log(user);
});

// Update user data
client.user.get(1).then((user) => {
  user.update({
    email: "test@pterolink.dev",
    username: "test",
    first_name: "test",
    last_name: "test",
  });
});

// Delete user
client.user.get(1).then((user) => {
  user.delete();
});
```

</details>

### 🖥️ Server Management

<details>
<summary><b>Server Operations</b></summary>
<br>

```ts
import { PteroClient } from "pterolink";
import "dotenv/config";

const config = {
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
} as const;

const client = new PteroClient(config);

// List all servers
client.servers.list().then((servers) => {
  console.log(servers);
});

// Get server details
client.servers.get(1).then((server) => {
  console.log(server);
});

// Suspend a server
client.servers.get(1).then((server) => {
  server.suspend();
});

// Unsuspend a server
client.servers.get(1).then((server) => {
  server.unsuspend();
});
```

</details>

## ⚠️ Error Handling

PteroLink provides specific error types to help with debugging:

```ts
import { PteroClient, NotFoundError, ValidationError } from "pterolink";

try {
  const user = await client.user.get(999);
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error(`User not found: ${error.resourceId}`);
  } else if (error instanceof ValidationError) {
    console.error(`Validation error: ${error.message}`);
  } else {
    console.error(`Unknown error: ${error.message}`);
  }
}
```

> [!TIP]
> Always wrap your API calls in try/catch blocks to handle potential errors gracefully.

> [!IMPORTANT]
> Make sure to keep your API keys secure and never commit them to version control.

## 📚 Documentation

For more detailed documentation and examples, please visit our [GitHub repository](https://github.com/maybeizen/pterolink).

> [!NOTE]
> The documentation is continuously being improved. If you find any issues or have suggestions, please open an issue.

> [!CAUTION]
> As this library is in early development, breaking changes may be introduced between minor versions until we reach v1.0.0 stability.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">
  
Made with ❤️ by [maybeizen](https://github.com/maybeizen)
  
</div>
