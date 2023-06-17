const { SlashCommandBuilder } = require('discord.js');
const packageJSON = require('../../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Накласти мут на учасника')
		.addUserOption(option => option.setName('target').setDescription('Учасник для муту').setRequired(true))
		.addIntegerOption(option => option.setName('duration').setDescription('Тривалість муту в хвилинах').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Причина муту').setRequired(true)),
	async execute(interaction) {
		const member = interaction.options.getMember('target');
		const duration = interaction.options.getInteger('duration');
		const reason = interaction.options.getString('reason');
		const serverName = interaction.guild.name;
		const serverAvatarURL = interaction.guild.iconURL();
        const avatarURL = 'https://cdn-icons-png.flaticon.com/512/4230/4230422.png';
        const botAvatarURL = 'https://i.imgur.com/bjcHS8q.png';

		// Проверка прав на мут участника
		if (!interaction.member.permissions.has('MANAGE_ROLES')) {
			return interaction.followUp({ content: 'У вас недостатньо прав для накладання муту на учасників.', ephemeral: true });
		}

		// Проверка прав на мут участника
		if (!member.manageable) {
			return interaction.followUp({ content: 'Я не можу накласти мут на цього учасника.', ephemeral: true });
		}

		try {
			const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted'); // Замініть 'Muted' на назву вашої ролі для муту

			if (!muteRole) {
				return interaction.followUp({ content: 'Роль для муту не знайдена. Створіть роль з назвою "Muted" та надайте її необхідні дозволи.', ephemeral: true });
			}

			await member.roles.add(muteRole);

			setTimeout(async () => {
				await member.roles.remove(muteRole);
			}, duration * 60000); // Переведення хвилин у мілісекунди

			const moderator = interaction.user;
			const mutedEmbed = {
				color: 0xFF0000,
				thumbnail: {
					url: avatarURL,
				},
				title: 'Видача покарання',
				author: {
					name: `${serverName}`,
					icon_url: serverAvatarURL,
				},
				description: `**Модератор ${moderator.toString()} видав користувачеві ${member.toString()} мут на ${duration} хв. Причина: ${reason}**`,
				footer: {
					text: `${packageJSON.name} v${packageJSON.version} • ${new Date().toLocaleDateString()}`,
					icon_url: botAvatarURL,
				},
			};

			return interaction.followUp({ embeds: [mutedEmbed] });
		}
		catch (error) {
			console.error(error);
			return interaction.followUp({ content: 'Виникла помилка при накладанні муту на учасника.', ephemeral: true });
		}
	},
};
