//SPDX-License-Identifier: GL-3.0
pragma solidity >= 0.4.22 <0.9.0;

interface IFaucet{
    function addFunds() external payable;
    function withdrawl(uint withdrawlAmount) external;    
}