<div align="center">

# 🦅 PteroLink

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/pterolink.svg)](https://www.npmjs.com/package/pterolink)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)

### A modern, type-safe Node.js library for interacting with the Pterodactyl Panel API.

📌 **Quick Links:**
[Installation](#-installation) • [Features](#-features) • [Usage](#-usage-examples) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

> [!WARNING] > **Early Development Notice**:
> PteroLink is in active development. Expect breaking changes before v1.0.0.

---

## 📦 Installation

Install via your preferred package manager:

```sh
# npm
npm install pterolink

# yarn
yarn add pterolink

# pnpm
pnpm add pterolink
```

> [!IMPORTANT]
> PteroLink requires Node.js **v16+** and TypeScript **4.9+** for best compatibility.

---

## ✨ Features

✅ **Fully Typed** - Built with TypeScript for a robust developer experience  
⚡ **Promise-Based** - Supports async/await for seamless API interaction  
🌐 **Full API Coverage** - Works with both Application and Client API  
🛡️ **Detailed Error Handling** - Provides meaningful error messages  
🚦 **Rate Limit Handling** - Built-in protection against API rate limits  
📚 **Comprehensive Documentation** - Clear examples and extensive guides

---

## 🚀 Usage Examples

> [!IMPORTANT]
> All API methods return promises, making them easy to use with `async/await`.

### 🛠 Creating an Application Client

```ts
import { PteroClient } from "pterolink";
import "dotenv/config";

const client = new PteroClient({
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
});
```

### 👤 User Management

#### List All Users

```ts
client.users.list().then(console.log);
```

#### Create a User

```ts
client.users
  .create({
    email: "test@pterolink.dev",
    username: "test",
    first_name: "Test",
    last_name: "User",
  })
  .then(console.log);
```

#### User-Specific Operations

```ts
client.user.get(1).then(console.log);
client.user.get(1).then((user) => user.delete());
```

### 🖥️ Server Management

#### Server Operations

```ts
client.servers.list().then(console.log);
client.servers.get(1).then((server) => server.suspend());
client.servers.get(1).then((server) => server.unsuspend());
```

---

## ⚠️ Error Handling

PteroLink provides specific error types to improve debugging:

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
> Always wrap API calls in `try/catch` blocks to handle errors gracefully.

---

## 📚 Documentation

For full documentation, visit our [GitHub repository](https://github.com/maybeizen/pterolink).

> [!NOTE]
> Found an issue? Open an [issue](https://github.com/maybeizen/pterolink/issues) or submit a PR!

---

## 🤝 Contributing

We welcome contributions! Follow these steps to contribute:

1. **Fork** the repository
2. **Create** a new branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add an amazing feature'`)
4. **Push** to your branch (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Check out our [contribution guide](CONTRIBUTING.md) for more details.

Thank you for contributing! Your help improves PteroLink for everyone.

---

## 📄 License

PteroLink is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

<div align="center">
  
Made with ❤️ by [maybeizen](https://github.com/maybeizen)
  
</div>
