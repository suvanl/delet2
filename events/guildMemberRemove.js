// This event executes when a member leaves a server. Notifies users in the server that a user has left.

module.exports = class {
    constructor(client) {
      this.client = client;
    }
  
    async run(member) {
    // Loads the guild's settings
      const settings = this.client.getSettings(member.guild.id);
    
      // If "welcome" is off, don't proceed
      if (settings.welcomeEnabled.toLowerCase() !== "true") return;
  
      // Replaces the placeholders in the leave message with actual data.
      const leaveMessage = settings.leaveMessage.replace("{{user}}", member.user.tag);
  
      // Sends the leave message to the welcomeChannel defined in the guild's settings.
      member.guild.channels.find("name", settings.welcomeChannel).send(leaveMessage).catch(console.error);
    }
  };
  