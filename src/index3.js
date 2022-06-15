const {Client, Intents } = require('discord.js');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES]});
const createCaptcha  = require('./captcha');
const fs = require('fs');

require('dotenv').config()

client.on('guildMemberAdd', async(member) => {
    if (Date.now() - member.user.createdAt < 1000*60*60*24*5) {
        return await member.kick();
    }

    await member.roles.add('986379540219691020')
    const captcha = await createCaptcha();
    try {
        const msg = await member.send({
            files: [{
                attachment: `${__dirname}/captchas/${captcha}.png`,
                name: `${captcha}.png`
            }],
            content: 'Você tem 60 segundos para resolver o captcha', 
        });
        try {
            const validator = m => {
                if(m.author.bot) return;
                if(m.author.id === member.id && m.content === captcha) return true;
                else {
                    m.channel.send('Você inseriu um captcha incorreto.');
                    return false;
                }
            };
            const response = await msg.channel.awaitMessages({filter: validator, max: 1, time: 60000, errors: ['time']});
            if(response) {
                await msg.channel.send('Sua conta foi verificada. Boa diversão!');
                await member.roles.remove('986379540219691020')
                await member.roles.add('956920116673662986');
                fs.unlink(`${__dirname}/captchas/${captcha}.png`, (err => {
                    if (err) console.log(err);
                    else {
                      console.log("\nArquivo deletado");
                    }
                  }))
            }
        }
        catch(err) {
            console.log(err);
            await msg.channel.send('Tempo esgotado.');
            await member.kick();
            fs.unlink(`${__dirname}/captchas/${captcha}.png`, (err => {
                if (err) console.log(err);
                else {
                  console.log("\nArquivo deletado");
                }
              }))
        }
    }
    catch(err) {
        console.log(err);
    }
})

client.login(process.env.TOKEN);