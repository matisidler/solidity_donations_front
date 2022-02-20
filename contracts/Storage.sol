//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Storage is Ownable{
    address donationsSC;

    struct Benefited {
        bool exists;
        uint256 collected;
        uint256 target;
        string description;
    }

    mapping (address => Benefited) private map_benefited;
    address [] list_benefited;
    mapping (address => uint256) donators;

    modifier onlyDonations(){
        require(msg.sender == donationsSC);
        _;
    }

    function setDonationsAdr(address _adr) external onlyOwner {
        donationsSC = _adr;
    }


    function createNewBenefited(address _benefited, uint256 _target, string memory _description) public onlyDonations {
        Benefited memory newBenefited = Benefited(true, 0, _target, _description);
        map_benefited[_benefited] = newBenefited;
    }
    function listBenefitedPush(address _adr) public onlyDonations {
        list_benefited.push(_adr);
    }

    function addValueToDonators(address _donator, uint256 _value) public onlyDonations {
        donators[_donator] += _value;
    }
    function increaseCollected(address _benefited, uint256 amount) public onlyDonations {
        map_benefited[_benefited].collected += amount;
    }

    function getBenefited(address _benefited) public view onlyDonations returns (Benefited memory){
        return map_benefited[_benefited];
    }

    function getAllBenefited()public view onlyDonations returns (address [] memory){
        return list_benefited;
    }
    function deleteBenefited(address _benefited)public onlyDonations{
        delete map_benefited[_benefited];

        for (uint256 i = 0; i < list_benefited.length; i++){
            if (list_benefited[i] == _benefited){
                delete list_benefited[i];
            }
        }
    }
    function returnDonator(address _donator ) public view onlyDonations returns(uint256) {
        return donators[_donator];
    }

}