const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Найперша команда бота!'),
	async execute(interaction) {
		return interaction.reply('Pong!');
	},
};