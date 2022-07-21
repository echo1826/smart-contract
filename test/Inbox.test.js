// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const {interface, bytecode} = require('../compile');

// creating a web3 instance passing in a provider that tells it what network we want to connect to
const web3 = new Web3(ganache.provider());
let fetchedAccounts;
let inbox;
const initialString = "Hello World!"

beforeEach(async () => {
    // get a list of all accounts
    fetchedAccounts = await web3.eth.getAccounts();
    // use one of those accounts to deploy the contract
    // .Contract tells the web3 connection what the inbox contract is
    inbox = await new web3.eth.Contract(JSON.parse(interface))
    // deploy method is telling web3 to deploy a new copy of the contract
    .deploy({data: bytecode, arguments: [initialString]})
    // send method tells web3 to send out a transaction that creates the contract
    .send({from: fetchedAccounts[0], gas: '1000000'})
    // this operation will return us a direct connection to the contract, so the variable is our javascript representation of the contract
});

describe('Inbox',() => {
    it('deploys a contract', () => {
        // asserts if the contract has an address (meaning if the contract was deployed)
        assert.ok(inbox.options.address)
    });
    it('gets a message', async () => {
        // calling the message method (getting the message attribute defined on the Inbox contract)
        const message = await inbox.methods.message().call();
        assert.equal(message, initialString);
    });
    it('can change a message', async () => {
        // because the setMessage method is changing data on the block, you must create a transaction to call the function
        const newMessage = "Bye World!"
        // from field is who will pay the gas to call the message
        await inbox.methods.setMessage(newMessage).send({from: fetchedAccounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, newMessage);
    })
});

// PRACTICE MOCHA SYNTAX
// class Car {
//     park() {
//         return 'stopped';
//     }
//     drive() {
//         return 'vroom';
//     }
// }

// let car;

// beforeEach(() => {
//     car = new Car();
// })

// describe('Car methods', () => {
//     it('park should return stopped', () => {
//         assert.equal(car.park(), 'stopped');
//     });
//     it('drive should return vroom', () => {
//         assert.equal(car.drive(), 'vroom');
//     });
// })