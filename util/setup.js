const input = require("readline-sync");
const Enmap = require("enmap");
const fs = require("fs");

let baseConfig = fs.readFileSync("./util/setup_base.txt", "utf8");

const defaultSettings = {
  "prefix": "%",
  "modLogChannel": "delet-this",
  "modRole": "Moderator",
  "adminRole": "Administrator",
  "systemNotice": "false",
  "welcomeChannel": "general",
  "welcomeMessage": "Say hello to {{user}}, everyone! 🎉👋",
  "welcomeEnabled": "false",
  "currency": ">>No currency set<<",
  "language": "en-GB"
};

const settings = new Enmap({ name: "settings", cloneLevel: "deep" });

(async function() {
  console.log("Setting up delet's configuration...\nCTRL + C if you want to manually edit `config.js.example` into config.js!");
  await settings.defer;
  if (settings.has("default")) {
    if (input.keyInYN("Default settings already exist. Reset to default?")) {
      settings.set("default", defaultSettings);
    } else {
      console.log("First start - inserting default guild settings into the database...");
      settings.set("default", defaultSettings);
    }
  }

  const isGlitch = input.keyInYN("Are you hosted on Glitch.com? ");

  if (isGlitch.glitch) {
    baseConfig = baseConfig
      .replace("{{defaultSettings}}", JSON.stringify(defaultSettings, null, 2))
      .replace("{{fullURL}}", "${process.env.PROJECT_DOMAIN}")
      .replace("{{domain}}", "`${process.env.PROJECT_DOMAIN}.glitch.me`")
      .replace("{{port}}", "process.env.PORT")
      .replace("{{token}}", "process.env.TOKEN")
      .replace("{{oauthSecret}}", "process.env.SECRET")
      .replace("{{sessionSecret}}", "process.env.SESSION_SECRET");
    
    console.log("REMEMBER TO PLACE THE TOKEN, SECRET AND SESSION_SECRET IN YOUR .ENV FILE!");
    fs.writeFileSync("./config.js", baseConfig);
    console.log("Configuration has been written, enjoy!");
    return;
  }

  const token = input.question("Please enter the bot's token from the application page: ");
  const oauthSecret = input.question("Please enter the client secret from the application page: ");
  const saltyKey = input.question("Please enter a session security passphrase (used to encrypt session data): ");
  const host = input.question("Please enter your domain name (no http prefix, port optional. E.g. `localhost:8080` or `www.example.com`): ");
  const port = input.question("Please enter the port on which to host the local server (default is 81): ", {
    defaultInput: 81
  });

  baseConfig = baseConfig
    .replace("{{defaultSettings}}", JSON.stringify(defaultSettings, null, 2))
    .replace("{{fullURL}}", host)
    .replace("{{domain}}", `"${host.split(":")[0]}"`)
    .replace("{{port}}", port)
    .replace("{{token}}", `"${token}"`)
    .replace("{{oauthSecret}}", `"${oauthSecret}"`)
    .replace("{{sessionSecret}}", `"${saltyKey}"`);
  
  fs.writeFileSync("./config.js", baseConfig);
  console.log("REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!");
  console.log("Configuration has been written, enjoy!");
  await settings.close();
}());