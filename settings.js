const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "",
    // Session Id (starts with lite~)

    PREFIX: process.env.PREFIX || ".",
    // Bot command prefix

    BOT_NAME: process.env.BOT_NAME || "SPECTRA-V2",
    // Bot name (always uppercase)

    MODE: process.env.MODE || "public",
    // Bot mode: public, private, inbox, group

    LINK_WHITELIST: "youtube.com,github.com",
    LINK_WARN_LIMIT: 3,
    LINK_ACTION: "kick",

    AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
    AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",

    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY 𝐆𝐇𝐎𝐒𝐓 𝐊𝐈𝐍𝐆😆*",

    WELCOME: process.env.WELCOME || "true",
    ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
    ANTI_LINK: process.env.ANTI_LINK || "true",
    MENTION_REPLY: process.env.MENTION_REPLY || "false",

    MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/lm4a0b.jpg",
    ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/osou52.jpg",

    LIVE_MSG: process.env.LIVE_MSG || 
`> ʙᴏᴛ ɪs ᴀᴄᴛɪᴠᴇ ✅

ᴋᴇᴇᴘ ᴜsɪɴɢ ✦SPECTRA-V2✦ ғʀᴏᴍ 𝐆𝐇𝐎𝐒𝐓 𝐊𝐈𝐍𝐆 ⚡

*© ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ - ᴍᴅ*

> ɢɪᴛʜᴜʙ : github.com/ghost-king-tz/SPECTRA-V2`,

    STICKER_NAME: process.env.STICKER_NAME || "𝐆𝐇𝐎𝐒𝐓 𝐊𝐈𝐍𝐆",

    CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
    CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,💛,💚,💙,💜,🤎,🖤,🤍",

    DELETE_LINKS: process.env.DELETE_LINKS || "false",

    OWNER_NUMBER: process.env.OWNER_NUMBER || "26371475XXXX",
    OWNER_NAME: process.env.OWNER_NAME || "𝐆𝐇𝐎𝐒𝐓 𝐊𝐈𝐍𝐆",
    DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐆𝐇𝐎𝐒𝐓 𝐊𝐈𝐍𝐆*",

    READ_MESSAGE: process.env.READ_MESSAGE || "false",
    AUTO_REACT: process.env.AUTO_REACT || "false",
    ANTI_BAD: process.env.ANTI_BAD || "true",
    ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "true",
    AUTO_STICKER: process.env.AUTO_STICKER || "false",
    AUTO_REPLY: process.env.AUTO_REPLY || "true",
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
    PUBLIC_MODE: process.env.PUBLIC_MODE || "false",
    AUTO_TYPING: process.env.AUTO_TYPING || "true",
    READ_CMD: process.env.READ_CMD || "false",

    DEV: process.env.DEV || "255719632816",

    ANTI_VV: process.env.ANTI_VV || "true",
    ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox",

    AUTO_RECORDING: process.env.AUTO_RECORDING || "false",

    version: process.env.version || "0.0.5",

    START_MSG: process.env.START_MSG || 
`*Hᴇʟʟᴏ ᴛʜᴇʀᴇ SPECTRA-V2 ᴄᴏɴɴᴇᴄᴛᴇᴅ! 👋🏻* 

*ᴋᴇᴇᴘ ᴏɴ ᴜsɪɴɢ SPECTRA-V2 ᴍᴏᴅs🚩* 

> sᴜʙsᴄʀɪʙᴇ YᴏᴜTᴜʙᴇ ᴄʜᴀɴɴᴇʟ ғᴏʀ ᴛᴜᴛᴏʀɪᴀʟs
https://youtube.com/@ghostking10k

- *ʏᴏᴜʀ ʙᴏᴛ ᴘʀᴇғɪx: ➡️[ . ]*
> - ʏᴏᴜ ᴄᴀɴ ᴄʜᴀɴɢᴇ ᴜʀ ᴘʀᴇғɪx ᴜsɪɴɢ ᴛʜᴇ .ᴘʀᴇғɪx ᴄᴏᴍᴍᴀɴᴅ

> ᴅᴏɴᴛ ғᴏʀɢᴇᴛ ᴛᴏ ꜱʜᴀʀᴇ, ꜱᴛᴀʀ & ғᴏʀᴋ ᴛʜᴇ ʀᴇᴘᴏ ⬇️ 
https://github.com/ghost-king-tz/SPECTRA-V2

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐆𝐇𝐎𝐒𝐓 𝐊𝐈𝐍𝐆`
};
