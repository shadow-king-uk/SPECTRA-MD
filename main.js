require('dotenv').config();
const fs = require('fs');
const pino = require('pino');
const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');

const { state, saveState } = useSingleFileAuthState('./session.json');
const logger = pino({ level: 'silent' });

const commands = {};

// Load all commands from "commands" folder
fs.readdirSync('./commands').forEach(file => {
    const command = require(`./commands/${file}`);
    commands[command.name] = command;
});

async function startBot() {
    const sock = makeWASocket({
        logger,
        auth: state,
        // ⚠️ DO NOT show QR code
        printQRInTerminal: false 
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        const commandName = text.trim().split(' ')[0].toLowerCase();

        if (commands[commandName]) {
            try {
                await commands[commandName].execute(sock, msg);
            } catch (error) {
                console.error(`Error executing ${commandName}:`, error);
                await sock.sendMessage(msg.key.remoteJid, {
                    text: '⚠️ An error occurred while executing this command.'
                });
            }
        }
    });

    sock.ev.on('creds.update', saveState);
}

startBot();
