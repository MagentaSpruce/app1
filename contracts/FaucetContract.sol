//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 < 0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
    uint public numOfFunders;
    
    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;

    modifier limitWithdrawl(uint withdrawlAmount){
        require(withdrawlAmount <= 100000000000000000, "Withdrawl limit is 1 ETH. Please withdrawl a lower amount.");
        _;
    }

    receive() external payable {}

    function emitLog() public override pure returns(bytes32){
        return "Hey simpleton";
    }

    function addFunds() payable override external {
        address funder = msg.sender;
    

        if(!funders[funder]){
            uint index = numOfFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
        }
    }

    function withdrawl(uint withdrawlAmount) external override limitWithdrawl(withdrawlAmount) {
            payable(msg.sender).transfer(withdrawlAmount);   
    }

    function getFunderAtIndex(uint8 index) external view returns(address){
        return lutFunders[index];
    }

    function getAllFunders() external view returns (address[] memory){
        address[] memory _funders = new address[](numOfFunders);
        for (uint i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }
            return _funders;
    }
}

