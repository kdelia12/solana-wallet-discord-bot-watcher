const { Client, Intents } = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const token = process.env.TOKEN;
const address = process.env.ADDRESS;

async function fetchSolBalance() {
  const requestData = {
    jsonrpc: '2.0',
    id: 1,
    method: 'getBalance',
    params: [address]
  };

  try {
    const response = await axios.post('https://api.mainnet-beta.solana.com', requestData);
    const solBalance = (response.data.result.value / 1e9).toFixed(2);
    console.log(`SOL Balance: ${solBalance}`);
    client.user.setPresence({
      activities: [{ name: `${solBalance} SOL`, type: 'WATCHING' }],
      status: 'dnd'
    });
    setTimeout(fetchUsdtBalance, 15000); // Switch to USDT after 15 seconds
  } catch (error) {
    console.error(error);
  }
}

async function fetchUsdcBalance() {
  const requestData = {
    jsonrpc: '2.0',
    id: 2,
    method: 'getTokenAccountsByOwner',
    params: [
      address,
      {
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
      },
      {
        encoding: 'jsonParsed'
      }
    ]
  };

  try {
    const response = await axios.post('https://api.mainnet-beta.solana.com', requestData);
    const amounts = response.data.result.value.map(account => account.account.data.parsed.info.tokenAmount.amount);
    const totalAmount = amounts.reduce((total, amount) => total + parseInt(amount), 0);
    const usdcBalance = (totalAmount / 1e6).toFixed(2);
    console.log(`USDC Balance: ${usdcBalance}`);
    client.user.setPresence({
      activities: [{ name: `${usdcBalance} USDC`, type: 'WATCHING' }],
      status: 'dnd'
    });
    setTimeout(fetchSolBalance, 15000); // Switch to SOL after 15 seconds
  } catch (error) {
    console.error(error);
  }
}

async function fetchUsdtBalance() {
  const requestData = {
    jsonrpc: '2.0',
    id: 2,
    method: 'getTokenAccountsByOwner',
    params: [
      address,
      {
        mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'
      },
      {
        encoding: 'jsonParsed'
      }
    ]
  };

  try {
    const response = await axios.post('https://api.mainnet-beta.solana.com', requestData);
    const amounts = response.data.result.value.map(account => account.account.data.parsed.info.tokenAmount.amount);
    const totalAmount = amounts.reduce((total, amount) => total + parseInt(amount), 0);
    const usdtBalance = (totalAmount / 1e6).toFixed(2);
    console.log(`USDT Balance: ${usdtBalance}`);
    client.user.setPresence({
      activities: [{ name: `${usdtBalance} USDT`, type: 'WATCHING' }],
      status: 'dnd'
    });
    setTimeout(fetchUsdcBalance, 15000); // Switch to USDC after 15 seconds
  } catch (error) {
    console.error(error);
  }
}

client.on('ready', async () => {
  console.log('Bot is ready!');
  await fetchSolBalance(); // Start with SOL
});

client.login(token);