const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const pino = require('pino');
const readline = require('readline');
const NodeCache = require('node-cache');
const { Boom } = require('@hapi/boom');
const { PhoneNumber } = require('awesome-phonenumber');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    jidDecode,
    jidNormalizedUser,
    delay,
} = require('@whiskeysockets/baileys');

const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const { smsg } = require('./lib/myfunc');
const settings = require('./settings');

let owner = [];
try {
    owner = JSON.parse(fs.readFileSync('./data/owner.json'));
} catch {
    owner = [];
}

global.botname = "SPECTRA-V2";
global.themeemoji = "•";
global.phoneNumber = process.env.BOT_PHONE_NUMBER || "911234567890";

const pairingCode = !!global.phoneNumber || process.argv.includes("--pairing-code");
const useMobile = process.argv.includes("--mobile");

const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null;
const question = (text) => rl
    ? new Promise(resolve => rl.question(text, resolve))
    : Promise.resolve(settings.ownerNumber || global.phoneNumber);

const store = {
    messages: {},
    contacts: {},
    chats: {},
    groupMetadata: async (jid) => ({}),
    bind(ev) {
        ev.on('messages.upsert', ({ messages }) => {
            for (const msg of messages) {
                if (msg.key && msg.key.remoteJid) {
                    this.messages[msg.key.remoteJid] = this.messages[msg.key.remoteJid] || {};
                    this.messages[msg.key.remoteJid][msg.key.id] = msg;
                }
            }
        });
        ev.on('contacts.update', (contacts) => {
            for (const contact of contacts) {
                if (contact.id) this.contacts[contact.id] = contact;
            }
        });
        ev.on('chats.set', (chats) => { this.chats = chats; });
    },
    loadMessage: async (jid, id) => this.messages[jid]?.[id] || null,
};

async function startBot() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const msgRetryCounterCache = new NodeCache();

    const bot = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            const jid = jidNormalizedUser(key.remoteJid);
            const msg = await store.loadMessage(jid, key.id);
            return msg?.message || "";
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    });

    store.bind(bot.ev);

    bot.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            const decode = jidDecode(jid) || {};
            return decode.user && decode.server ? `${decode.user}@${decode.server}` : jid;
        }
        return jid;
    };

    bot.getName = async (jid, withoutContact = false) => {
        const id = bot.decodeJid(jid);
        let v;
        if (id.endsWith("@g.us")) {
            v = store.contacts[id] || {};
            if (!(v.name || v.subject)) v = await bot.groupMetadata(id) || {};
            return v.name || v.subject || id;
        }
        v = id === '0@s.whatsapp.net'
            ? { id, name: 'WhatsApp' }
            : id === bot.decodeJid(bot.user.id)
            ? bot.user
            : (store.contacts[id] || {});
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || id;
    };

    bot.public = true;
    bot.serializeM = (m) => smsg(bot, m, store);

    bot.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages?.[0];
            if (!mek?.message) return;

            mek.message = Object.keys(mek.message)[0] === 'ephemeralMessage'
                ? mek.message.ephemeralMessage.message
                : mek.message;

            if (mek.key?.remoteJid === 'status@broadcast') {
                return await handleStatus(bot, chatUpdate);
            }

            if (!bot.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
            if (mek.key.id && mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return;

            await handleMessages(bot, chatUpdate, true);
        } catch (err) {
            console.error("Error in handleMessages:", err);
        }
    });

    bot.ev.on('contacts.update', update => {
        for (const contact of update) {
            const id = bot.decodeJid(contact.id);
            if (store.contacts) store.contacts[id] = { id, name: contact.notify };
        }
    });

    bot.ev.on('connection.update', async (s) => {
        const { connection, lastDisconnect } = s;
        if (connection === "open") {
            console.log(chalk.green(`✅ SPECTRA-V2 Connected: ${bot.user.id}`));
        }
        if (
            connection === "close" &&
            lastDisconnect &&
            lastDisconnect.error &&
            lastDisconnect.error.output.statusCode !== 401
        ) {
            startBot(); // Reconnect
        }
    });

    bot.ev.on('creds.update', saveCreds);

    bot.ev.on('group-participants.update', async (update) => {
        await handleGroupParticipantUpdate(bot, update);
    });

    // PAIRING CODE
    if (pairingCode && !state.creds?.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile API');

        let userNumber = global.phoneNumber || await question("Enter phone number: ");
        userNumber = userNumber.replace(/[^0-9]/g, '');
        if (!userNumber.startsWith('+')) userNumber = '+' + userNumber;

        if (!PhoneNumber(userNumber).isValid()) {
            console.log(chalk.red('Invalid phone number.'));
            process.exit(1);
        }

        setTimeout(async () => {
            try {
                let code = await bot.requestPairingCode(userNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(chalk.green(`🔗 Pairing Code: ${code}`));
            } catch (error) {
                console.error('Failed to get pairing code:', error);
            }
        }, 2000);
    }

    return bot;
}

// Run the bot
startBot().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});

process.on('uncaughtException', err => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', err => console.error('Unhandled Rejection:', err));

// Hot reload
const file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Updated ${__filename}`));
    delete require.cache[file];
    require(file);
});

// ✅ EXPRESS SERVER FOR HEROKU
const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('🤖 SPECTRA-V2 WhatsApp Bot is alive!');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(chalk.green(`🌐 Web server running on port ${port}`));
});
