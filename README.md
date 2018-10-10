# imux-node

A Node.js module for acessing the [MIT-xperts iMux Multiplexer](http://www.mit-xperts.com/products/imux/)

## Dependencies

- mime
- request
- request-promise

## Installation

```bash
  npm i imux
```

## Usage

```javascript
const iMux = require('imux');

const sendEPGToiMuxServers = async (zipPath) => {
    await iMux.login(process.env.IMUX_API_BASE, process.env.IMUX_USER, process.env.IMUX_PASSWORD);
    await iMux.uploadZipFile(1, zipPath, true);
    await iMux.activate();
    await iMux.logoff();
};
```

## Maintainer

[Jon Ribeiro][0]

## License

MIT

[0]: https://github.com/jonathas