# Cyphernode Client for NPM

Links

 - [GitHub](https://github.com/SatoshiPortal/cyphernode-client-npm)
 - [NPM](https://www.npmjs.com/package/cyphernode-client)

Install with

`npm install -s cyphernode-client`

Setup and use

```
const Cyphernode = require('cyphernode-client');

Cyphernode.set({
  baseURL: '{String}',
  apiId: '{String}',
  apiKey: '{String}',
  // optional
  isMock: false,
})

Cyphernode.getBalance((err, res) => {  })
```

