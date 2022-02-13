// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    // storage variables
    uint256 public funds = 1000;
    int256 public counter = -10;

    receive() external payable {}

    function justTesting() external pure returns (uint256) {
        return 2 + 2;
    }
}
