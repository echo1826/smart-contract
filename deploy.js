// deploy code will go here
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

const api = `https://rinkeby.infura.io/v3/${process.env.API_KEY}`;


const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    api
);
const web3 = new Web3(provider);

