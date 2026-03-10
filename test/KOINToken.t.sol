// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {KOINToken} from "../contracts/KOINToken.sol";
import {Errors} from "../contracts/libraries/Errors.sol";
import {KoinaraFixture} from "./helpers/KoinaraFixture.sol";

contract KOINTokenTest is KoinaraFixture {
    function testOnlyRewardDistributorCanMint() public {
        vm.expectRevert(abi.encodeWithSelector(Errors.Unauthorized.selector));
        token.mint(provider, 1 ether);
    }

    function testCapExceededMintReverts() public {
        KOINToken localToken = new KOINToken(address(this));
        localToken.setMinter(address(this));
        localToken.mint(address(0x1234), localToken.cap());

        vm.expectRevert(abi.encodeWithSelector(Errors.CapExceeded.selector));
        localToken.mint(address(0x1234), 1);
    }
}
