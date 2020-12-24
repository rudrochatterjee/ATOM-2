const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const api = require("imageapi.js")
const ytdl = require("ytdl-core")
client.on('ready', message =>{
    console.log('music bot is on')
})
const prefix = config.prefix;
client.on('message', async message =>{
    if(message.author.bot) return
    if(!message.content.startsWith(prefix)) return

    const args = message.content.substring(config.prefix.length).split(" ")

    if(message.content.substring(`${prefix}play`)){
        const vc = message.member.voice.channel
        if(!vc) return message.channel.send('you need to join a vc to play song')
        const perm = vc.permissionsFor(message.client.user)
        if(!perm.has("CONNECT")) return message.channel.send("i dont have permission to connect")
        if(!perm.has('SPEAK')) return message.channel.send("i dont have permission to speak")

        try{
           var connection = await vc.join()
        } catch (error) {
           console.log(` There was an error to join the channel : ${error}`)
           return message.channel.send(`There was an error to join the channel : ${error}`)
        }

        const dispatcher = connection.play(ytdl(args[1]))
        .on('finish', () => {
            vc.leave()
        })
        .on('error', error => {
            console.log(error)
        })
        dispatcher.setVolumeLogarithmic(5 / 5)
    }else if(message.content.startsWith(`${prefix}stop`)){
        if(!message.member.voice.channel) return message.channel.send('you need to be in a vc to stop the music') .then(m => {
        message.member.voice.channel.leave()
    })
        return undefined
    }
})

client.login(config.token)
