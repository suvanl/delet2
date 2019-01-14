// Copyright (c) 2019 An Idiot's Guide. All rights reserved. MIT license.
// https://github.com/AnIdiotsGuide/guidebot-class

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {

    // Await is used here because the ready event isn't actually ready; sometimes
    // guild information will come in AFTER ready. 1 second (1000ms) is generally enough time
    // for everything to be loaded.
    // NOTE: client.wait and client.log are added by ./modules/functions.js
    await this.client.wait(1000);

    // This loop ensures that client.appInfo always contains up to date data
    // about the app's status. This includes whether the bot is public or not,
    // its description, owner, etc. Primarily used for the dashboard amongst other things.
    this.client.appInfo = await this.client.fetchApplication();
    setInterval( async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    // Now checks whether the "Default" guild settings are loaded in the enmap.
    // If they're not, they'll be written in. This should only happen on first load.
    if (!this.client.settings.has("default")) {
      if (!this.client.config.defaultSettings) throw new Error("defaultSettings not preset in config.js or settings database. Bot cannot load.");
      this.client.settings.set("default", this.client.config.defaultSettings);
    }

    // Initialises the dashboard, which must be done during the `ready` event.
    // Otherwise, some data may be missing from the dashboard. 
    require("../modules/dashboard.js")(this.client);
    
    // Sets the status to Do Not Disturb for 5 seconds, to visually indicate to 
    // users that the client is restarting or has just been started up.
    this.client.user.setStatus("dnd");
    await this.client.wait(5000);

    // Sets the client's status back to Online to visually indicate to users that
    // it is (almost) ready.
    this.client.user.setStatus("online");

    // Sets the bot's game/status as "Watching over {number} servers"
    // NOTE: This is also set in the guildCreate and guildDelete events.
    this.client.user.setActivity(`over ${this.client.guilds.size} servers`, { type: "WATCHING" });
  
    // Logs that the bot is ready to serve and run, so we know the bot accepts commands.
    this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`, "ready");
  }
};
