// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IKOINToken {
    function cap() external view returns (uint256);
    function minter() external view returns (address);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function mint(address to, uint256 amount) external;
}
