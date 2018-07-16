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
    // "FUN" CATEGORY

    // Rate command
    noRate: "You must provide something for me to rate.",

    // Roll command
    rolling: "Rolling...",
    rolled: "You rolled a {{result}}!",

    // Slots command
    slotWin: "**You won!** That was definitely down to your immense skill.",
    slotLoss: "**You lost!** It was just down to bad luck, of course.",


    // "INFORMATION" CATEGORY

    // Avatar command
    avatar: "{{user}}'s avatar",

    // Discriminator command
    invalidDiscrim: "Invalid discriminator provided.",
    discrimNotFound: "After searching all my servers, no one with the discriminator **#{{discrim}}** could be found.",
    discrim: "user(s) found with the discriminator **#{{discrim}}**",

    // DSDev command
    dsDev: "Interested in joining the team that develops and maintains me?\nVisit this link:",

    // EmojiImage command
    noEmoji: "You must provide an emoji for me to look up.",
    regularEmoji: "{{emoji}} is a regular Discord emoji, from Twemoji.",
    invalidEmoji: "You must provide a valid emoji.",

    
    // "SYSTEM" CATEGORY
    noMessage: "You must provide a message to send.",
    idRequest: "Please enter the channel ID of the channel the message should be sent to...",

    // "UTILITY" CATEGORY
    
    // Shorten command
    noLink: "Please provide a link to shorten.",
    invalidURL: "Invalid URL provided.",
    shortened: "Your shortened link:"
};

// Help messages
exports.help = {
    mentionHelp: "Hey! Looking for help? Use `{{prefix}}help` for a list of commands, or head to **https://delet.js.org/docs** for further help, including topics such as changing my prefix and language for this server.",
    dmNotSent: "Oops, looks like the message didn't make it to your DMs, {{author}}. Please ensure \"**Allow direct messages from server members**\" is on in your privacy settings for this server.",
    dmCommands: "Please note that due to the `help` command being run in DMs, only commands that work in DMs are shown in the list of commands.\nFor a list of *all* commands available for your permission level, please run the `help` command in a server.",
    usage: "usage",
    aliases: "aliases"
};

// Music system specific messages
exports.music = {
    noVoiceChannel: "You must be in a voice channel to use this command.",
    noConnect: "I cannot connect to your voice channel, due to insufficient permissions.",
    noSpeak: "I cannot play any music, as I do not have the \"Speak\" permission.",
    playlistAdded: "The playlist {{playlist}} has been added to the queue.",

    songSelection: "Song Selection",
    songSelectionInfo: "Please provide a value to select one of the search results, ranging from **1** to **10**.\nThe song selection time period is 15 seconds.",
    songSelectionCancel: "Invalid or null value provided; cancelling video selection."
};

// Permission names
exports.permNames = {
    ADMINISTRATOR: "Administrator",
    CREATE_INSTANT_INVITE: "Create Instant Invite",
    KICK_MEMBERS: "Kick Members",
    BAN_MEMBERS: "Ban Members",
    MANAGE_CHANNELS: "Manage Channels",
    MANAGE_GUILD: "Manage Server",
    ADD_REACTIONS: "Add Reactions",
    VIEW_AUDIT_LOG: "View Audit Log",
    VIEW_CHANNEL: "Read Messages",
    SEND_MESSAGES: "Send Messages",
    SEND_TTS_MESSAGES: "Send TTS Messages",
    MANAGE_MESSAGES: "Manage Messages",
    EMBED_LINKS: "Embed Links",
    ATTACH_FILES: "Attach Files",
    READ_MESSAGE_HISTORY: "Read Message History",
    MENTION_EVERYONE: "Mention Everyone",
    USE_EXTERNAL_EMOJIS: "Use External Emojis",
    CONNECT: "Connect",
    SPEAK: "Speak",
    MUTE_MEMBERS: "Mute Members",
    DEAFEN_MEMBERS: "Deafen Members",
    MOVE_MEMBERS: "Move Members",
    USE_VAD: "Use Voice Activity",
    CHANGE_NICKNAME: "Change Nickname",
    MANAGE_NICKNAMES: "Manage Nicknames",
    MANAGE_ROLES: "Manage Roles",
    MANAGE_WEBHOOKS: "Manage Webhooks",
    MANAGE_EMOJIS: "Manage Emojis"
};
