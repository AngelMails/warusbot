const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Показує інформацію про сервер[BETA].'),
	async execute(interaction) {
		return interaction.reply(`Назва серверу: ${interaction.guild.name}\nУчасників серверу: ${interaction.guild.memberCount}`);
	},
};