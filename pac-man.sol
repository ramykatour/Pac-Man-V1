// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameToken {
    string public name = "Game Token";
    string public symbol = "GT";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10 ** uint256(decimals);
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    address public owner;

    constructor() {
        owner = msg.sender;
        balanceOf[owner] = totalSupply;
    }

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from], "Insufficient balance");
        require(_value <= allowance[_from][msg.sender], "Allowance exceeded");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function rewardPlayer(address _player, uint256 _score) public onlyOwner {
        uint256 reward = calculateReward(_score);
        require(balanceOf[owner] >= reward, "Insufficient tokens to reward");
        balanceOf[owner] -= reward;
        balanceOf[_player] += reward;
        emit Transfer(owner, _player, reward);
    }

    function calculateReward(uint256 _score) internal pure returns (uint256) {
        return _score * 10 ** 18; // 1 score = 1 GT token
    }
}
