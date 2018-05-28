// Messages (strings)
exports.modLogNotFound = "Modlog channel not found. If you're an admin (or owner) on this server, please use:```{{prefix}}set edit modLogChannel [channel-name]```\nFor example: `{{prefix}}set edit modLogChannel cool-channel-name`.";

exports.poweredBy = "Moderation system powered by delet";

exports.error = "An error occurred:\n```{{err}}```";

exports.missingPerm = "I cannot run this command as I have insufficient permissions to do so. Please ensure I have the \"{{perm}}\" permission.";

exports.missingPerms = "I cannot run this command as I have insufficient permissions to do so. Please ensure I have the \"{{perms}}\" permissions.";

exports.mentionHelp = "Hey! Looking for help? Use `{{prefix}}help` for a list of commands, or head to **https://delet.js.org/docs** for further help, including topics such as changing my prefix and language for this server.";

exports.guildOnly = "This command is unavailable via direct message. Please run this command in a guild (server).";

exports.cmdDisabled = "This command is unavailable as it has been temporarily disabled, or is still in development.";


// Messages (strings) for music system
exports.noVoiceChannel = "You must be in a voice channel to use this command.";

exports.noConnect = "I cannot connect to your voice channel, due to insufficient permissions.";

exports.noSpeak = "I cannot play any music, as I do not have the \"Speak\" permission.";

exports.playlistAdded = "The playlist {{playlist}} has been added to the queue.";

exports.songSelection = "Song Selection";
exports.songSelectionInfo = "Please provide a value to select one of the search results, ranging from **1** to **10**.\nThe song selection time period is 15 seconds.";
exports.songSelectionCancel = "Invalid or null value provided; cancelling video selection.";

exports.noResultsFound = "No search results found.";
