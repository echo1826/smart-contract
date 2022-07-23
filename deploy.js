// deploy code will go here
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {abi, evm} = require('./compile');

const api = `https://rinkeby.infura.io/v3/${process.env.API_KEY}`;

const initialString = "Hello World!";
const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    api
);
const web3 = new Web3(provider);

async function deploy() {
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(abi).deploy({data: evm.bytecode.object, arguments: [initialString]}).send({from: accounts[0], gas: '1000000'});

    console.log("contract deployed to", result.options.address);
    provider.engine.stop();
}

deploy();