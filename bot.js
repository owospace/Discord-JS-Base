
// ---------------------------------------------------------
// Import all required modules below.
// ---------------------------------------------------------
// 'Discord' is the default, but you can add stuff like
// Twitter streams and so forth here.
// ---------------------------------------------------------
Discord = require('discord.js');

const path = require('path');
const fs = require('fs');



// ---------------------------------------------------------
// Define some basics here.
// This will have your Client and Commands by default.
// ---------------------------------------------------------
// 'bot' is the client here.
const bot = new Discord.Client();

// Store the commands in a Map (slightly better than a raw object).
const commands = new Map();



// ---------------------------------------------------------
// Now the actual physical loader/pre-setup.
// First featuring... a fancy cmd display!
// ---------------------------------------------------------
// Display a fancy cmd-based message to the operator.
console.log('\n---------------------------------------------------------');
console.log(`             Your Discord Bot Loader`);
console.log('---------------------------------------------------------\n');

// Check that the configuration file exists.
// If it does exist (which it should!) just continue, otherwise, error and exit.
const config = (() => {
    if (!fs.existsSync('config.json')) {
        console.error('[ERROR]: The configuration file is missing!\nPlease ensure you have a config.json file present and/or have the correct permissions!');
        process.exit(1);
    }

// Load the configuration in JSON format.
// This will continue unless any issues occur whilst loading it.
// If any issues do occur, it'll just error and exit.
    let json;
    try {
        json = JSON.parse(fs.readFileSync('config.json').toString());
    } catch (error) {
        console.error(`[ERROR]: The configuration file failed to load!\n${error}`);
        process.exit(1);
    }

// Check that the token provided is valid.
// If the token provided in the config.json file is
// invalid, it will error and exit, otherwise continue.
    if (json.token && !/^[a-zA-Z0-9_\.\-]{59}$/.test(json.token)) {
        console.error('[ERROR]: The configuration file does not have a valid token!\nPlease ensure you have a Bot Token generated and filled in!');
        process.exit(1);
    }
    return json;
});

// Check for files that have ".js" on the end.
// If a invalid file is present, IE: "example.txt" it will
// just simply not load the file.
fs.readdirSync(path.resolve(__dirname, 'commands'))
    .filter(cmd => cmd.endsWith('.js'))
    .forEach(cmd => {
        // Notify the operator that the command is loading.
        console.log(`[INFO]: Loading command ${f}`);
        try {
            // Require the raw file from the 'commands' directory.
            let command = require(`./commands/${f}`);

            // Ensure that there is a valid run function and help object
            // This also displays a message if there is missing information
            if (typeof command.run !== 'function') {
                throw 'Command does not have a run function!';
            } else if (!command.help || !command.help.name) {
                throw 'Command does not have a help object!';
            }

            // Store the command in the map based on its name.
            // This is slightly better than a raw object.
            commands.set(command.help.name, command);

        } catch (error) {
            // Notify the operator if there is any issues whilst loading the command.
            console.error(`[ERROR]: (${f}) ${error}`);
        }
    });



// ---------------------------------------------------------
// Bot Configuration
// ---------------------------------------------------------
// Assign the config and commands on the bot, allowing them
// to be easily accessible in commands and other files.
// ---------------------------------------------------------
bot.commands = commands;
bot.config = config;
bot.prefix = config.prefix;
bot.name = config.name;




// ---------------------------------------------------------
// Now actually assign code to the bot events
// ---------------------------------------------------------
// This'll have all of your "ready" and "message" stuff.
// Find out more on the discord.js documentation.
// https://discord.js.org/#/docs/main/stable/class/Client
// ---------------------------------------------------------
bot.on('ready', () => {
  console.log(`\nConnected as ${bot.user.tag} (ID: ${bot.user.id})`)
});

bot.on('message', message => {

    // Ignore messages from other bots or DMs
    if (message.author.bot || !message.guild) {
        return;
    }

    // Quickly assign a shorthand variable
    let { content } = message;

    // This will reject any messages that do not have the prefix.
    // You can change the prefix in the config.json file.
    if (!content.startsWith(config.prefix)) {
        return;
    }

    // Take everything after the prefix and split it so it becomes
    // an array, IE: "pls help" becomes "['pls', 'help']"
    let split = content.substr(config.prefix.length).split(' ');
    // Get the command to run, this is the first word after the prefix.
    // (IE: prefix + "info")
    let label = split[0];

    // Get the arguments after the label. This can be used for instance...
    // The @user(s) being the arguments. prefix + ban + @user + @user
    let args = split.slice(1);

    // Check there is actually a command to run.
    if (commands.get(label)) {
        // Get the command to run and use the message and
        // arguments as parameters.
        commands.get(label).run(bot, message, args);
    }

});



// *And it's done!
bot.login(config.token);
