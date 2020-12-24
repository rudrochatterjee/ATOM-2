const { executionAsyncResource } = require('async_hooks');
const Discord = require('discord.js');
const { measureMemory } = require('vm');
const ytdl = require('ytdl-core');
const fs = require('fs')

const { YTSearcher } = require('ytsearcher');

const searcher = new YTSearcher({
    key: "AIzaSyDsGp7lYJOOd5EI2Rw42QYM_K7SZp1Iph4",
    revealed: true
});

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir("./commands/", (e, f) => {
    if(e) return console.error(e);
    f.forEach(file => {
        if(!file.endsWith(".js")) return
        console.log(`${file} has been loaded`)
        let cmd = require(`./commands/${file}`);
        let cmdName = cmd.config.name;
        client.commands.set(cmdName, cmd)
        cmd.config.aliases.forEach(alias => {
            client.aliases.set(alias, cmdName);
        })
    })
})



const queue = new Map();

client.on("ready", () => {
    console.log("I am online!")
})


client.on("guildMemberAdd", member => {
    if (member.user.bot){
        let role = member.guild.roles.cache.find(role => role.name === "Dumbass")
        return member.roles.add(role)
    }

    let role = member.guild.roles.cache.find(role => role.name === "Epic Gamers")
    member.roles.add(role)
})


client.on("message", async(message) => {
    const prefix = '!!';

    if(!message.content.startsWith(prefix)) return
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if(!cmd) return

    try {
        cmd.run(client, message, args, queue, searcher);
    }catch (err){
        return console.error(err)
    }
        
})

const token = "NzkxMjc5NzM2NTExNzkxMTY1.X-M2rg.V08BoWY2-VmGdqvCDHlIfYBv3yM"

client.login(token)