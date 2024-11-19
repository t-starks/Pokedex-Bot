const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra la latencia del bot'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Calculando ping...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`🏓 Pong! Latencia: ${ms(latency)} ms.`);
    },
};