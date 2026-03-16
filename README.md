# NOTE: Deprecated
With latest workerd compatibility with the nodejs apis, `tls` has enough support to reliably use `mongodb` npm module without issue

# cf-mongodb-polyfills
This package allows the use of the `mongodb` npm package in a cloudflare worker. It does this by polyfilling the `net` and `tls` modules in the `mongodb` package to use the `cf-mongodb-polyfills` package instead.


## Description

Currently cloudflare's workerd does not support using `mongodb` package to connect to mongodb. This is due to the fact that `net.createConnection` and `tls.connect` arent
implemented in the worker runtime ([ref](https://developers.cloudflare.com/workers/runtime-apis/nodejs/#nodejs-api-polyfills)) even with the `nodejs_compat` or `nodejs_compat_v2` compatiblity flags enabled.

However, via the use of the [`module aliasing`](https://developers.cloudflare.com/workers/wrangler/configuration/#module-aliasing) feature in `wrangler.toml`, we can replace the `net` and `tls` modules in the `mongodb` package with polyfills in this package. This package provides polyfills for the `net` and `tls` modules which will use `cloudflare:sockets` npm package to create a tcp connection to the mongodb server.


## Installation

To install the package, run:

```sh
npm install cf-mongodb-polyfills
```

### Modify `wrangler.toml`

To use the package in a cloudflare worker app, you must create [module aliases](https://developers.cloudflare.com/workers/wrangler/configuration/#module-aliasing) in the wrangler.toml to point to the polyfills that are in this package.

```toml
# wrangler.toml
# ...

[alias]
"net" = "cf-mongodb-polyfills/net"
"dns" = "cf-mongodb-polyfills/dns"
"tls" = "cf-mongodb-polyfills/tls"
```


## Usage

With these changes in place, you can now use the `mongodb` package in your cloudflare worker app.

```typescript
import { MongoClient } from 'mongodb';

export default {
  async fetch(request, env, ctx): Promise<Response> {

    // connect to atlas mongodb
    const tlsClient = new MongoClient('mongodb+srv://sharedddas:sdfaqwevccfjkjde9ei@dvi.kevpg.mongodb.net/?retryWrites=true&w=majority&appName=dev');
    await tlsClient.connect();

    // connect to mongo running locally
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();

    const db = tlsClient.db('test');
    const users = await db.collection('users').find({}).toArray().limit(10);

    return Response.json({
      users
    })
  },
} satisfies ExportedHandler<Env>;
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
