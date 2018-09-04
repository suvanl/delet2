module.exports = class {
    constructor(client) {
      this.client = client;
    }
  
    async run(error) {
        this.client.logger.error(`Discord API Error:\n${JSON.stringify(error)}`);
    }
  };