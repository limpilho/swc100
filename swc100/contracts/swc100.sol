// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HashForEther {
    function withdrawWinnings() public {
        // Winner if the last 8 hex characters of the address are 0. 
        require(uint32(msg.sender) == 0,
        "msg.sender not 8hex 00000000");
        
        _sendWinnings();
     }

     function _sendWinnings() internal {    
        msg.sender.transfer(this.balance);
     }

     function a() payable{}
}
