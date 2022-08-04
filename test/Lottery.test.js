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
    });

    it('only a manager can pick a winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: fetchedAccounts[1]
            });
            assert(false);
        } catch(err) {
            assert(err)
        }
    });

    it('sends money to the winner and reset players', async () => {
        await lottery.methods.enter().send({
            from: fetchedAccounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(fetchedAccounts[0]);

        await lottery.methods.pickWinner().send({
            from: fetchedAccounts[0]
        });

        const finalBalance = await web3.eth.getBalance(fetchedAccounts[0]);

        // even though the difference should be 2 ether, must take into account the amount of gas being paid for each , thus must test if the difference is close enough to 2 ether, not exactly 2 ether
        const difference = finalBalance - initialBalance;
        
        assert(difference > web3.utils.toWei('1.8', 'ether'));

        const players = await lottery.methods.getPlayers().call({
            from: fetchedAccounts[0]
        });

        assert.equal(0, players.length);

        const lotteryBalance = await web3.eth.getBalance(lottery.options.address);

        assert.equal(0, lotteryBalance);
    });

    it('ouput winners address', async () => {
        await lottery.methods.enter().send({
            from: fetchedAccounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        await lottery.methods.pickWinner().send({
            from: fetchedAccounts[0]
        });

        const winner = await lottery.methods.getWinner().call();

        assert.equal(fetchedAccounts[0], winner);
    })
});