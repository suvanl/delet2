// This event executes when a new member joins a server. Welcomes the new user to the server.

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
  // Loads the guild's settings
    const settings = this.client.getSettings(member.guild.id);
  
    // If welcome is off, don't proceed (doesn't welcome the user).
    if (settings.welcomeEnabled.toLowerCase() !== "true") return;

    // Replaces the placeholders in the welcome message with actual data.
    const welcomeMessage = settings.welcomeMessage.replace("{{user}}", member.user.tag);

    // Sends the welcome message to the welcome channel.
    member.guild.channels.find("name", settings.welcomeChannel).send(welcomeMessage).catch(console.error);
  }
};
