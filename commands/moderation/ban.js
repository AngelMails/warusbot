const { SlashCommandBuilder } = require('discord.js');
const packageJSON = require('../../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Заблокувати користувача на сервері')
        .addUserOption(option => option.setName('target').setDescription('Учасник для бану').setRequired(true))
        .addIntegerOption(option => option.setName('days').setDescription('Кількість днів бану').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Причина бану').setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('target');
        const days = interaction.options.getInteger('days');
        const reason = interaction.options.getString('reason');
        const serverName = interaction.guild.name;
        const serverAvatarURL = interaction.guild.iconURL();
        const avatarURL = 'https://cdn-icons-png.flaticon.com/512/4230/4230422.png';
        const botAvatarURL = 'https://i.imgur.com/bjcHS8q.png';

        // Перевірка прав на бан учасника
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'У вас недостатньо прав для бану користувача.', ephemeral: true });
        }

        // Перевірка прав на бан учасника
        if (!member.bannable) {
            return interaction.reply({ content: 'Я не можу забанити цього користувача.', ephemeral: true });
        }

        try {
            await member.ban({ days, reason });

            const moderator = interaction.user;
            const bannedEmbed = {
                color: 0xFF0000,
                thumbnail: {
                    url: avatarURL,
                },
                title: 'Видача покарання',
                author: {
                    name: `${serverName}`,
                    icon_url: serverAvatarURL,
                },
                description: `**Модератор ${moderator.toString()} видав користувачеві ${member.toString()} блокування на ${days} днів. Причина: ${reason}**`,
                footer: {
                    text: `${packageJSON.name} v${packageJSON.version} • ${new Date().toLocaleDateString()}`,
                    icon_url: botAvatarURL,
                },
            };

            return interaction.reply({ embeds: [bannedEmbed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Виникла помилка при блокуванні користувача.', ephemeral: true });
        }
    },
};