// specifies the version of solidity we are writing in/what we are compiling in
pragma solidity ^0.4.17;

// contract defines a new contract definition equivalent to classes in programming languages
contract Inbox {
    // storage variable, basically the same as an attribute on a class
    // the storage variable will stay on the blockchain with the contract in contrast to a local variable which will not be stored onto the blockchain and "garbage collected"/thrown away
    // public is the same as java, specifies who has access to this variable
    string public message;

    // functions defined on the contract, like instance methods on a class
    // if the function has the same name as the contract it is the constructor function or the init function
    function Inbox(string initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }

    function getMessage() public view returns (string) {
        return message;
    }
}