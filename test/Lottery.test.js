// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { abi, evm } = require('../compileLottery');

// creating a web3 instance passing in a provider that tells it what network we want to connect to
const web3 = new Web3(ganache.provider());
let fetchedAccounts;
let lottery;

beforeEach(async () => {
    // get a list of all accounts
    fetchedAccounts = await web3.eth.getAccounts();
    // use one of those accounts to deploy the contract
    // .Contract tells the web3 connection what the inbox contract is
    lottery = await new web3.eth.Contract(abi)
        // deploy method is telling web3 to deploy a new copy of the contract
        .deploy({ data: evm.bytecode.object })
        // send method tells web3 to send out a transaction that creates the contract
        .send({ from: fetchedAccounts[0], gas: '1000000' })
    // this operation will return us a direct connection to the contract, so the variable is our javascript representation of the contract
});

describe('Lottery', () => {
    it("deploys the contract", () => {
        assert.ok(lottery.options.address)
    });

    it("Allows one account to enter", async () => {
        // the value specifies the amount of ether to send in this transaction for this function call
        await lottery.methods.enter().send({
            from: fetchedAccounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        // get list of players address who entered the lottery
        const players = await lottery.methods.getPlayers().call({
            from: fetchedAccounts[0]
        });
        assert.equal(1, players.length);

        assert.equal(fetchedAccounts[0], players[0]);
    });

    it("Allows multiple accounts to enter", async () => {
        for(let i = 0; i < 3; i++) {
            await lottery.methods.enter().send({
                from: fetchedAccounts[i],
                value: web3.utils.toWei('0.02', 'ether')
            });
        }

        const players = await lottery.methods.getPlayers().call({
            from: fetchedAccounts[0]
        });

        for(let i = 0; i < 3; i++) {
            assert.equal(fetchedAccounts[i], players[i]);
        }
        assert.equal(3, players.length)
    });

    it('requires a minimum amount of ether to enter', async () => {
        try{
            await lottery.methods.enter().send({
                from: fetchedAccounts[0],
                value: 0
            });
            assert(false);
        } catch(err) {
            assert(err);
        }
    })
});