// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IKOINToken} from "./interfaces/IKOINToken.sol";
import {Errors} from "./libraries/Errors.sol";
import {Events} from "./libraries/Events.sol";

contract KOINToken is IKOINToken, Events {
    string public constant name = "Koinara";
    string public constant symbol = "KOIN";
    uint8 public constant decimals = 18;
    uint256 public constant override cap = 2_100_000_000 ether;

    address public admin;
    address public override minter;
    uint256 public override totalSupply;

    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    modifier onlyAdmin() {
        if (msg.sender != admin) {
            revert Errors.Unauthorized();
        }
        _;
    }

    modifier onlyMinter() {
        if (msg.sender != minter) {
            revert Errors.Unauthorized();
        }
        _;
    }

    constructor(address admin_) {
        if (admin_ == address(0)) {
            revert Errors.ZeroAddress();
        }

        admin = admin_;
    }

    function setMinter(address minter_) external onlyAdmin {
        if (minter_ == address(0)) {
            revert Errors.ZeroAddress();
        }
        if (minter != address(0)) {
            revert Errors.MinterAlreadySet();
        }

        minter = minter_;
        emit MinterSet(minter_);
    }

    function renounceAdmin() external onlyAdmin {
        emit AdminRenounced(admin);
        admin = address(0);
    }

    function mint(address to, uint256 amount) external override onlyMinter {
        if (to == address(0)) {
            revert Errors.ZeroAddress();
        }
        if (totalSupply + amount > cap) {
            revert Errors.CapExceeded();
        }

        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        if (spender == address(0)) {
            revert Errors.ZeroAddress();
        }

        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed < amount) {
            revert Errors.InsufficientAllowance();
        }

        if (allowed != type(uint256).max) {
            allowance[from][msg.sender] = allowed - amount;
            emit Approval(from, msg.sender, allowance[from][msg.sender]);
        }

        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        if (to == address(0)) {
            revert Errors.ZeroAddress();
        }

        uint256 fromBalance = balanceOf[from];
        if (fromBalance < amount) {
            revert Errors.InsufficientBalance();
        }

        unchecked {
            balanceOf[from] = fromBalance - amount;
        }
        balanceOf[to] += amount;

        emit Transfer(from, to, amount);
    }
}
