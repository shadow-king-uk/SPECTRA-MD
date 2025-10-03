const moment = require('moment-timezone');
const fetch = require('node-fetch');

async function githubCommand(sock, chatId, message) {
  try {
    const res = await fetch('https://api.github.com/repos/ghost-king-tz/spectra-v2');
    if (!res.ok) throw new Error('Error fetching repository data');
    const json = await res.json();

    const caption = `
*乂  𝐒𝐏𝐄𝐂𝐓𝐑𝐀-𝐕2 乂*

✩  *Name*: ${json.name}
✩  *Watchers*: ${json.watchers_count}
✩  *Size*: ${(json.size / 1024).toFixed(2)} MB
✩  *Last Updated*: ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}
✩  *URL*: ${json.html_url}
✩  *Forks*: ${json.forks_count}
✩  *Stars*: ${json.stargazers_count}

「Powered by 𝐆𝐇𝐎𝐒𝐓 𝐊𝐈𝐍𝐆」
`.trim();

    await sock.sendMessage(chatId, {
      image: { url: 'https://files.catbox.moe/w0vmvc.jpg' }, // tumia picha badala ya video
      caption: caption
    }, { quoted: message });
  } catch (error) {
    await sock.sendMessage(chatId, { text: 'FOR SALE.' }, { quoted: message });
  }
}

module.exports = githubCommand;
