// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

/**
 * @title Lottery
 * @notice Players pay to enter the lottery and the owner pick the winner at the end of the raffle
 */
contract Lottery {

    /**
     * @dev Address of person who created the contract
     */
    address public owner;

    /**
     * @dev Addresses of people who have entered the lottery 
     */
    address payable[] public players;

    constructor() {
       owner = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev Enters a player into the lottery
     */
    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(payable(msg.sender));
    }

     /**
     * @dev Generates a pseudo-random number
     * Check Chainlink at https://stackoverflow.com/questions/48848948/how-to-generate-a-random-number-in-solidity
     */
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players)));
    }

    /**
     * @dev Randomly picks a winner and sends them the prize pool
     */
    function pickWinner() public payable restricted {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }

    /**
     * @dev Returns the list of players
     */
    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }

}