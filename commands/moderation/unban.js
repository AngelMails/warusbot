const { SlashCommandBuilder } = require('discord.js');
const packageJSON = require('../../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Розблокувати користувача на сервері')
        .addUserOption(option => option.setName('target').setDescription('Користувач для розблокування').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Причина розблокування').setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const serverName = interaction.guild.name;
        const serverAvatarURL = interaction.guild.iconURL();
        const avatarURL = 'https://cdn-icons-png.flaticon.com/512/4230/4230422.png';
        const botAvatarURL = 'https://i.imgur.com/bjcHS8q.png';

        // Перевірка прав на розблокування користувача
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'У вас недостатньо прав для розблокування користувача.', ephemeral: true });
        }

        try {
            await interaction.guild.members.unban(target, reason);

            const moderator = interaction.user;
            const unbannedEmbed = {
                color: 0x00FF00,
                thumbnail: {
                    url: avatarURL,
                },
                title: 'Розблокування користувача',
                author: {
                    name: `${serverName}`,
                    icon_url: serverAvatarURL,
                },
                description: `**Модератор ${moderator.toString()} розблокував користувача ${target.toString()}. Причина: ${reason}**`,
                footer: {
                    text: `${packageJSON.name} v${packageJSON.version} • ${new Date().toLocaleDateString()}`,
                    icon_url: botAvatarURL,
                },
            };

            await interaction.reply({ embeds: [unbannedEmbed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Виникла помилка при розблокуванні користувача.', ephemeral: true });
        }
    },
};
