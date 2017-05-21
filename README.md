# express-rpc-beeson

beeson wrapper for express-rpc

```JS
var myPromiseBaseModule = require('my-promise-based-module');
var rpcMiddleware = require('express-rpc-beeson')(myPromiseBaseModule);

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
