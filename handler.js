const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const config = require('./config.json');

const clientId = process.env.CLIENT_ID;
const guildId = config.guildId;

if (!clientId || !process.env.TOKEN) {
    console.error('❌ Error: CLIENT_ID o TOKEN no definidos en el archivo .env.');
    process.exit(1);
}

if (!guildId) {
    console.error('❌ Error: guildId no está definido en config.json.');
    process.exit(1);
}

const commands = [];

const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        if (!command?.data || typeof command.data.toJSON !== 'function') {
            console.warn(`⚠️ El archivo ${file} no tiene la estructura correcta y será ignorado.`);
            continue;
        }
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('⌛ Iniciando los comandos slash');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log('✅ Comandos registrados');
    } catch (error) {
        if (error.code === 50001) {
            console.error('❌ Error: Permisos insuficientes para registrar comandos.');
        } else {
            console.error('❌ Error al registrar comandos:', error);
        }
    }
})();
