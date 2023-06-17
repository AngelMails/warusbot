const { SlashCommandBuilder } = require('discord.js');
const packageJSON = require('../../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Кікнути учасника з серверу')
		.addUserOption(option => option.setName('target').setDescription('Учасник для кіку').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Причина кіку').setRequired(true)),
	async execute(interaction) {
		const member = interaction.options.getMember('target');
		const reason = interaction.options.getString('reason');
		const serverName = interaction.guild.name;
		const serverAvatarURL = interaction.guild.iconURL();
		const avatarURL = 'https://cdn-icons-png.flaticon.com/512/4230/4230422.png';
		const botAvatarURL = 'https://i.imgur.com/bjcHS8q.png';

		// Перевірка прав на кік учасника
		if (!interaction.member.permissions.has('KICK_MEMBERS')) {
			return interaction.reply({ content: 'У вас недостатньо прав для кіку користувача.', ephemeral: true });
		}

		// Перевірка прав на кік учасника
		if (!member.kickable) {
			return interaction.reply({ content: 'Я не можу кікнути цього користувача.', ephemeral: true });
		}

		try {
			await member.kick(reason);

			const moderator = interaction.user;
			const kickedEmbed = {
				color: 0xFF0000,
				thumbnail: {
					url: avatarURL,
				},
				title: 'Видача покарання',
				author: {
					name: `${serverName}`,
					icon_url: serverAvatarURL,
				},
				description: `**Модератор ${moderator.toString()} кікнув користувача ${member.toString()}. Причина: ${reason}**`,
				footer: {
					text: `${packageJSON.name} v${packageJSON.version} • ${new Date().toLocaleDateString()}`,
					icon_url: botAvatarURL,
				},
			};

			return interaction.reply({ embeds: [kickedEmbed] });
		}
		catch (error) {
			console.error(error);
			return interaction.reply({ content: 'Виникла помилка при кіку користувача.', ephemeral: true });
		}
	},
};