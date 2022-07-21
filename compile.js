// compile code will go here
const fs = require('fs');
const path = require('path');
const solc = require('solc');

// getting the folder path for our inbox contract
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
// actually unpackaging the source code of the contract
const source = fs.readFileSync(inboxPath, 'utf8');

// exporting just the definition of the compiled contract for deployment
module.exports = solc.compile(source, 1).contracts[':Inbox'];