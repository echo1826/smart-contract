// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const { describe } = require('mocha');
const Web3 = require('web3');

// creating a web3 instance passing in a provider that tells it what network we want to connect to
const web3 = new Web3(ganache.provider());



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