module.exports = class {
    constructor(client) {
      this.client = client;
    }
  
    async run(message) {
        this.client.on("messageDelete", () => this.client.logger.debug("Message deleted."));
    }
  };