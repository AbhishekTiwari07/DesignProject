// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Contract{
    
    address public owner;
    
    struct Charity{
        string name;
        string cause;
        address src;
        uint target;
    }
    
    struct Donate {
        string name;
        uint value;
        address src;
        address dest;
    }
    
    Charity[] public charity;
    Donate[] public donate;
    
    event Transfer(address sender, address receiver, uint amount);
    
    constructor() public{
        owner = address(this);
    }
    
    function addCharity(string memory name,string memory cause, uint target) public{
        Charity memory temp = Charity(name, cause, msg.sender, target);
        charity.push(temp);
    }
    
    
    function donateTo(string memory name,uint amount, address payable dest) public payable{
        require(msg.value >= amount, "Failed to send Ether");
        bool pay = dest.send(msg.value);
        require(pay, "Failed to send Ether");
        Donate memory temp = Donate(name, amount, msg.sender, dest);
        donate.push(temp);
        for(uint i=0; i<charity.length; i++){
            if(charity[i].src == dest)
                charity[i].target -=amount;
        }
    }
    
    function getAddress() view public returns(address) {
        address from = msg.sender;
        return from;
    }
    
    function getBalance() public view returns (uint256) {
        return msg.sender.balance;
    }
}