// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface Vm {
    function warp(uint256 newTimestamp) external;
    function prank(address msgSender) external;
    function startPrank(address msgSender) external;
    function stopPrank() external;
    function deal(address account, uint256 newBalance) external;
    function expectRevert(bytes calldata revertData) external;
}

error AssertionFailed();

contract TestBase {
    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function assertTrue(bool condition) internal pure {
        if (!condition) {
            revert AssertionFailed();
        }
    }

    function assertEq(uint256 left, uint256 right) internal pure {
        if (left != right) {
            revert AssertionFailed();
        }
    }

    function assertEq(address left, address right) internal pure {
        if (left != right) {
            revert AssertionFailed();
        }
    }

    function assertEq(bytes32 left, bytes32 right) internal pure {
        if (left != right) {
            revert AssertionFailed();
        }
    }

    function assertEq(bool left, bool right) internal pure {
        if (left != right) {
            revert AssertionFailed();
        }
    }
}
