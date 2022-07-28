// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
// linter warnings (red underline) about pragma version can igonored!

contract Lottery {
    // address type specific for the address hash
    address public manager;

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

        players.push(msg.sender);
    }
}