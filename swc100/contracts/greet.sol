// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract greet{
    string greeting;

    constructor() {
        greeting = "hello";
    }
    //문자열을 메모리에 저장
    function getGreeting() public view returns(string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public{
        greeting = _greeting;
    }

}