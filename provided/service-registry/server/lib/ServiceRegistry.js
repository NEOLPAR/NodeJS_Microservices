const semver = require('semver');

class ServiceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeout = 30;
  }

  get(name, version) {
    this.cleanup();
    const candidates = Object.values(this.services)
      .filter(service => service.name === name && semver.satisfies(service.version, version));

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  register(name, version, ip, port) {
    this.cleanup();
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

  unregister(name, version, ip, port) {
    const key = name + version + ip + port;

    this.log.debug(`Unregistered services ${name}, version ${version} at ${ip}:${port}`);
    delete this.services[key];

    return key;
  }

  cleanup() {
    const now = Math.floor(new Date() / 1000);

    Object.keys(this.services).forEach((key) => {
      if (this.services[key].timestamp + this.timeout < now) {
        delete this.services[key];

        this.log.debug(`Removed service ${key}`);
      }
    });
  }
}

module.exports = ServiceRegistry;
