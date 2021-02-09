const Discord = require('discord.js'),
    client = new Discord.Client({
		fetchAllMembers: true
	}),
    config = require('./config.json'),
    fs = require('fs')

client.login(config.token)
client.commands = new Discord.Collection()

fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})

client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return

    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    command.run(message, args, client)
})

client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`:clap: Bienvenue ${member} ! Nous te souhaitons de passez un agréable moment sur le serveur :headphones: ***Discosique*** :thumbsup: https://f.hellowork.com/blogdumoderateur/2013/02/gif-anime.gif`)
})

client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member.user.tag} a quitté le serveur...! 😢 https://tenor.com/view/mandalorian-baby-yoda-baby-yoda-wave-magic-hand-thing-baby-yoda-magic-hand-thing-gif-15921838`)
})
