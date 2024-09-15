// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract Certificate is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => uint[]) public studentCertificates;
    mapping(address => uint[]) public studentCourses;

    constructor() ERC721('Certifyme', 'CRT') {}

    function awardItem(
        uint256 courseId,
        string memory tokenURI
    ) public returns (uint256) {
        for (uint i = 0; i < studentCourses[msg.sender].length; i++) {
            if (studentCourses[msg.sender][i] == courseId) {
                revert();
            }
        }
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        studentCertificates[msg.sender].push(newItemId);
        studentCourses[msg.sender].push(courseId);
        _tokenIds.increment();
        return newItemId;
    }

    function getCertificates(
        address _student
    ) external view returns (uint256[] memory) {
        return studentCertificates[_student];
    }
}
