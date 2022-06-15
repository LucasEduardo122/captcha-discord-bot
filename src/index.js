const {Client, Intents, MessageEmbed } = require('discord.js');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES]});

require('dotenv').config()

const { Captcha } = require("discord.js-captcha");

const captcha = new Captcha(client, {
    guildID: "955963675968163890",
    roleID: "956920116673662986", //optional
    channelID: "Text Channel ID Here", //optional
    sendToTextChannel: false, //optional, defaults to false
    addRoleOnSuccess: true, //optional, defaults to true. whether you want the bot to add the role to the user if the captcha is solved
    kickOnFailure: true, //optional, defaults to true. whether you want the bot to kick the user if the captcha is failed
    caseSensitive: true, //optional, defaults to true. whether you want the captcha responses to be case-sensitive
    attempts: 3, //optional, defaults to 1. number of attempts before captcha is considered to be failed
    timeout: 30000, //optional, defaults to 60000. time the user has to solve the captcha on each attempt in milliseconds
    showAttemptCount: true, //optional, defaults to true. whether to show the number of attempts left in embed footer
    customPromptEmbed: new MessageEmbed().setColor('#0000FF').setTitle('Validação Yomus').setDescription('Digite no chat a imagem que você vê abaixo'), //customise the embed that will be sent to the user when the captcha is requested
    customSuccessEmbed: new MessageEmbed().setColor('#008000').setTitle('Validação Concluída'), //customise the embed that will be sent to the user when the captcha is solved
    customFailureEmbed: new MessageEmbed().setColor('#FF0000').setTitle('Falha ao validar').setDescription('URL DE INVITE: https://discord.gg/F7fANXEfqP'), //customise the embed that will be sent to the user when they fail to solve the captcha
});

client.on('guildMemberAdd', async(member) => {
    await member.roles.add('986379540219691020')
    captcha.present(member);

    captcha.on("success", async data => {
        await member.roles.remove('986379540219691020')
    });
})

client.login(process.env.TOKEN);