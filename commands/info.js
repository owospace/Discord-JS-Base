exports.run = (bot, msg, args) => {

  let seconds = (bot.uptime / 1000).toFixed();
  let minutes = Math.floor(seconds / 60).toFixed();
  let hours = Math.floor(seconds / 3600).toFixed();

  let embed = new Discord.MessageEmbed()
  .setAuthor(bot.name)
  .addField(`Version`, bot.version, true)
  .addField(`Library`, `[discord.js](https://discord.js.org/#/)`, true)
  .addField(`Uptime`, hours + " hours " + minutes + " minutes " + seconds + " seconds", true)
  .addField(`Servers`, `${bot.guilds.cache.size}`, true)
  .addField(`Users`, msg.guild.memberCount, true)
  .addField(`Discord`, `[Click](https://discord.gg/evCkJWTEA9)`, true)
  .addField(`Developer`, `space#0002`, true)
  .setFooter(footer)
  .setTimestamp()
  .setColor(12370112);

  msg.channel.send(embed);
};

exports.help = {
    name: 'info',
    usage: 'info',
    description: 'Displays information about the running bot.'
};
