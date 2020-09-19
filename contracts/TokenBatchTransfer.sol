//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.10;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenBatchTransfer is Ownable {
    function distributeTokens(IERC20[] calldata tokens, address receiver)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20 token = tokens[i];
            token.transferFrom(
                msg.sender,
                receiver,
                token.balanceOf(msg.sender)
            );
        }

        // wipe contract and anything left over back caller
    }

    function destroy() external onlyOwner {
        selfdestruct(msg.sender);
    }
}
