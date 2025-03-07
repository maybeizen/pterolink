# PteroLink

An npm package for interaction with the Pterodactyl Panel API, simple and user friendly. Similar to PteroJS.

**PteroLink is currently in the process of being redesigned with Typescript**

## Examples:

### Creating Application Client

```ts
import { PteroClient } from "pterolink";
import "dotenv/config";

const config = {
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
} as const;

const client = new PteroClient(config);
```

### List All Users

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

### Creating Users

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

### User-Specific Methods

```ts
import { PteroClient } from "pterolink";
import "dotenv/config";

const config = {
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
} as const;

const client = new PteroClient(config);

// pass user id in args
client.user.get(1).then((user) => {
  console.log(user);
});

// updating user data
const user = client.user.get(1).then((user) => {
  user.update({
    email: "test@pterolink.dev",
    username: "test",
    first_name: "test",
    last_name: "test",
  });
});

// delete user
const user = client.user.get(1).then((user) => {
  user.delete();
});
```
