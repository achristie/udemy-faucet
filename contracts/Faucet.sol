// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    // storage variables
    uint256 public numOfFunders;
    address public owner;
    mapping(address => bool) public funders;
    mapping(uint256 => address) public lutFunders;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    receive() external payable {}

    function addFunds() external payable {
        address funder = msg.sender;
        if (!funders[funder]) {
            uint256 idx = numOfFunders++;
            funders[funder] = true;
            lutFunders[idx] = funder;
        }
    }

    function withdraw(uint256 withdrawAmount) external {
        require(
            withdrawAmount <= 1000000000000000000,
            "Cannot withdraw more than 1 ether"
        );
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint256 i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }
        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        return lutFunders[index];
    }
}
