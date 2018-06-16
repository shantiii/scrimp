const net = require('net');

export default class Hata {
  constructor(options) {
    if (
      options.hasOwnProperty("seed") &&
      options.seed.hasOwnProperty("features") &&
      options.seed.hasOwnProperty("version") &&
      Number.isInteger(options.seed.version)
    ) {
      this.version = options.seed.version;
      this.features = options.seed.features;
    } else {
      this.version = 0;
      this.features = {};
    };

    this.client = net.createConnection( options.net_opts, () => {
      console.log('connected to server!');
      client.write('world!\r\n');

      client.on('data', (data) => {
        console.log(data.toString());
      });

      client.on('end', () => {
        console.log('disconnected from server');
      });
    });
  }

  test(name, context) {
    this.features[name]
  }
}

