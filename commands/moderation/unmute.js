const { SlashCommandBuilder } = require('discord.js');
const packageJSON = require('../../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Зняти мут з користувача')
        .addUserOption(option => option.setName('target').setDescription('Користувач для зняття муту').setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('target');
        const serverName = interaction.guild.name;
        const serverAvatarURL = interaction.guild.iconURL();
        const avatarURL = 'https://cdn-icons-png.flaticon.com/512/4230/4230422.png';
        const botAvatarURL = 'https://i.imgur.com/bjcHS8q.png';

        // Перевірка прав на зняття муту з учасника
        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            return interaction.reply({ content: 'У вас недостатньо прав для зняття муту з користувачів.', ephemeral: true });
        }

        // Перевірка чи учасник має роль з мутом
        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

        if (!muteRole || !member.roles.cache.has(muteRole.id)) {
            return interaction.reply({ content: 'У цього користувача немає муту.', ephemeral: true });
        }

        try {
            await member.roles.remove(muteRole);

            const moderator = interaction.user;
            const unmutedEmbed = {
                color: 0x00FF00,
                thumbnail: {
                    url: avatarURL,
                },
                title: 'Зняття муту з користувача',
                author: {
                    name: `${serverName}`,
                    icon_url: serverAvatarURL,
                },
                description: `**Модератор ${moderator.toString()} зняв мут з корстиувача ${member.toString()}.**`,
                footer: {
                    text: `${packageJSON.name} v${packageJSON.version} • ${new Date().toLocaleDateString()}`,
                    icon_url: botAvatarURL,
                },
            };

            return interaction.reply({ embeds: [unmutedEmbed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Виникла помилка при знятті муту з користувача.', ephemeral: true });
        }
    },
};
