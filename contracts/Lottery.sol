// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
// linter warnings (red underline) about pragma version can igonored!

contract Lottery {
    // address type specific for the address hash
    address public manager;
    address public lastWinner;
    address[] players;

    constructor() public {
        // the msg object is a global object that is always available
        // contains information about the address that started the current function invocation, data field from the call or transaction that invoked the current function (data), amount of gas the current function invocation has available (gas), amount of ether, in wei, that was sent along with the function invocation
        manager = msg.sender;
    }

    // payable identifier means that there will be ether attached whenever this function is invoked/called
    function enter() public payable {
        // require is a global function that can be accessed anywhere in solidity, it's used for validation, like validating the player paid enough ether to enter into the lottery
        require(msg.value > .01 ether);

        // making the player being pushed into the lottery a payable player because msg.sender is not automatically payable
        players.push(payable(msg.sender));
    }

    function random() private view returns (uint) {
        // sha3 is a global function that will hash out the arguments passed into it as a number
        // block is a global variable that we can access at any time, difficulty refers to the current mining difficulty, ~15 seconds
        // timestamp refers to the current time
        // recasted the keccak256 data type to uint256 explicitly (returned a byte32, or a string with max length of 32)
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    // restricted modifier used on this function to make sure only the manager can call this function
    function pickWinner() public restricted {
        // make sure the manager is the only one who can pick the winner
        // require(msg.sender == manager);

        uint index = random() % players.length;

        // transfer function will send wei to the address attached to it
        // address(this).balance will send the current balance attached to the contract instance
        payable(players[index]).transfer(address(this).balance);
        lastWinner = players[index];
        // remakes the players array without any players, the (0) is an initial size/length for the new array
        // if the array was initialized with a length, the array would contain addresses with 0's because there were no intial values give for the array i.e. [0x0000000, 0x00000000, 0x0000000...]
        players = new address[](0);
    }

    // function modifier 
    modifier restricted() {
        require(msg.sender == manager);
        // the underscore represents the function body that the modifier is attached to if the above conditional passes then the function will run
        // modifiers are used to not repeat the same require statement on multiple functions that needs that depends on the conditional to run
        _;
    }

    function getPlayers() public view returns (address[] memory){
        return players;
    }

    function getWinner() public view returns (address) {
        return lastWinner;
    }
}