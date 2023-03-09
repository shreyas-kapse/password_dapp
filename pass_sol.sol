// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PasswordManager {
    struct Password {
        bytes32 encryptedPassword;
        bytes32 iv;
        bytes32 salt;
    }

    mapping (address => Password[]) private passwords;

    function addPassword(bytes32 encryptedPassword, bytes32 iv, bytes32 salt) public {
        passwords[msg.sender].push(Password(encryptedPassword, iv, salt));
    }

    function getPasswords() public view returns (bytes32[] memory, bytes32[] memory, bytes32[] memory) {
        Password[] memory userPasswords = passwords[msg.sender];
        bytes32[] memory encryptedPasswords = new bytes32[](userPasswords.length);
        bytes32[] memory ivs = new bytes32[](userPasswords.length);
        bytes32[] memory salts = new bytes32[](userPasswords.length);

        for (uint i = 0; i < userPasswords.length; i++) {
            Password memory password = userPasswords[i];
            encryptedPasswords[i] = password.encryptedPassword;
            ivs[i] = password.iv;
            salts[i] = password.salt;
        }

        return (encryptedPasswords, ivs, salts);
    }

    function deletePassword(uint index) public {
        Password[] storage userPasswords = passwords[msg.sender];
        require(index < userPasswords.length, "Index out of range");

        for (uint i = index; i < userPasswords.length - 1; i++) {
            userPasswords[i] = userPasswords[i+1];
        }
        userPasswords.pop();
    }
}
