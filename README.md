# express-rpc-beeson

beeson wrapper for express-rpc

```JS
const myPromiseBaseModule = require('my-promise-based-module');
const { middleware: rpcMiddleware } = require('express-rpc-beeson')(myPromiseBaseModule);

// ...

app.use(rpcMiddleware);
// Profit
```

# install
with [npm](https://npmjs.org) do:

```
npm install express-rpc-beeson
```

# license

MIT
