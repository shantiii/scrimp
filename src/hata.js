const net = require('net');

class FeatureProtocol {
  static parseInt(buffer, offset) {
    return {value: buffer.readInt32BE(offset), offset: offset+4}
  }
  static parseString(buffer, offset) {
    const {value: length, offset: str_offset} = parseInt(buffer, offset);
    const value = buffer.toString('utf8', str_offset, length);
    return {value: value, offset: str_offset+length}
  }
  static parseArray(buffer, offset) {
    const {value: length, offset: off_0} = parseInt(buffer, offset);
    let acc = [], next_off = off_0;
    for(let i=0; i < length; ++i) {
      let result = parseValue(buffer, next_off);
      acc.push(result.value);
      next_off = result.offset;
    }
    return {value: acc, offset: next_off}
  }
  static parseDefaultLink(buffer, offset) {
    const {value: name, offset: next_off} = parseString(buffer,offset);
    const result = parseString
    return {value: 2, offset: }
  }
  static parseValue(buffer, offset) {
    const data_offset = offset+1;
    switch(buffer[offset]) {
      case 0x00: /* integer */
        return parseInt(buffer, data_offset);
      case 0x01: /* string */
        return parseString(buffer, data_offset);
      case 0x02: /* array */
        return parseArray(buffer, data_offset);
      case 0x80:
        return parseDefaultLink(buffer, data_offset);
      default:
        return
    }
  }

}

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
      this.client.write('world!\r\n');

      this.client.on('data', (data) => {
        console.log(data);
      });

      this.client.on('end', () => {
        console.log('disconnected from server');
      });
    });
  }

  test(name, context) {
    this.features[name]
  }
}
