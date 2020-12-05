class ServiceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeout = 30;
  }

  register(name, version, ip, port) {
    const key = name + version + ip + port;

    if (!this.services[key]) {
      // eslint-disable-next-line object-curly-newline
      this.services[key] = { ip, port, name, version };

      this.log.debug(`Added services ${name}, version ${version}, at ${ip}:${port}`);
    } else {
      this.log.debug(`Updated services ${name}, version ${version} at ${ip}:${port}`);
    }

    this.services[key].timestamp = Math.floor(new Date() / 1000);

    return key;
  }
}

module.exports = ServiceRegistry;