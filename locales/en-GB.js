// General messages (used throughout delet)
exports.general = {
    error: "An error occurred:\n```{{err}}```",
    missingPerm: "I cannot run this command as I have insufficient permissions to do so. Please ensure I have the \"{{perm}}\" permission.",
    missingPerms: "I cannot run this command as I have insufficient permissions to do so. Please ensure I have the \"{{perms}}\" permissions.",
    guildOnly: "This command is unavailable via direct message. Please run this command in a guild (server).",
    cmdDisabled: "This command is unavailable as it has been temporarily disabled, or is still in development.",
    noResultsFound: "No search results found."
};

// Moderation system messages
exports.moderation = {
    modLogNotFound: "Modlog channel not found. If you're an admin (or owner) on this server, please use:```{{prefix}}set edit modLogChannel [channel-name]```\nFor example: `{{prefix}}set edit modLogChannel cool-channel-name`.",
    poweredBy: "Moderation system powered by delet"
};

// Command-specific messages
exports.cmd = {
    // Rate command
    noRate: "You must provide something for me to rate."
};

// Help messages
exports.help = {
    mentionHelp: "Hey! Looking for help? Use `{{prefix}}help` for a list of commands, or head to **https://delet.js.org/docs** for further help, including topics such as changing my prefix and language for this server."
};

// Music system messages
exports.music = {
    noVoiceChannel: "You must be in a voice channel to use this command.",
    noConnect: "I cannot connect to your voice channel, due to insufficient permissions.",
    noSpeak: "I cannot play any music, as I do not have the \"Speak\" permission.",
    playlistAdded: "The playlist {{playlist}} has been added to the queue.",

    songSelection: "Song Selection",
    songSelectionInfo: "Please provide a value to select one of the search results, ranging from **1** to **10**.\nThe song selection time period is 15 seconds.",
    songSelectionCancel: "Invalid or null value provided; cancelling video selection."
};
