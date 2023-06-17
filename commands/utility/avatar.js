const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Отримайте URL-адресу аватара обранного користувача або свій власний аватар.')
		.addUserOption(option => option.setName('target').setDescription('Показати аватар обранного користувача.')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		if (user) return interaction.reply(`${user.username} аватар: ${user.displayAvatarURL()}`);
		return interaction.reply(`Ваш аватар: ${interaction.user.displayAvatarURL()}`);
	},
};