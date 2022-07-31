// compile code will go here
const fs = require('fs');
const path = require('path');
const solc = require('solc');

// getting the folder path for lottery contract
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
// actually unpackaging the source code of the contract
const source = fs.readFileSync(lotteryPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'Lottery.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            "*": {
                '*': ['*']
            }
        }
    }
}


// exporting just the definition of the compiled contract for deployment
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Lottery.sol'].Lottery

