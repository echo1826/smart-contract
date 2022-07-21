# Running Contract Functions

## Calling a function
- cannot modify the contract's data
- can return data
- runs instantly
- free to do

## Sending a Transaction to a Function
- can modify a contract's data
- takes time to execute (block time)
- returns the transaction hash
- costs money

# Web3
- can use web3 to connect to a network
- once connected to a network you can use that web3 connection to deploy a contract onto the network (must know the ABI and the bytecode of the contract)
- can also use web3 to interact with contracts that have already been deployed (must know the ABI and the address of deployed contract)
- currentProvider field is the communication layer with the actual blockchain
- requestManager is tied to the provider and helps facilitate communication with the provider
- methods field are going to contain the actual functions/attributes of the contract that you can use/invoke
- options field contains data about the contract that was deployed, most notably the address of the contract