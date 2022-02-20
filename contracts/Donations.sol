//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;
import "./DonateCoin.sol";
import "./Storage.sol";
/* 
Create a contract to receive donations.
User will be able to donate to different addresses, depending on the cause of the donation.
When a user donates, give them an NFT.

 */

contract Donations is DonateCoin{
    
    Storage ssc;
    address deployer;
    constructor(address _adr) {
        mint(address(this), 100 * 10 ** 18);
        ssc = Storage(_adr);
        deployer = msg.sender;
    }

    event NewDonation(address donator, address benefited, uint256 amountReceived, uint256 collected, uint256 target);
    event NewBenefited(address adr, string description, uint256 collected, uint256 target);
    event RemovedBenefited(address adr);

    function AddBenefited(address _benefited, uint256 _target, string memory _description) external onlyOwner {
        require(_benefited != address(0) && _benefited != address(this), "address must not be the address 0, or this contract");
        require(!ssc.getBenefited(_benefited).exists, "that address is already stored into the storage");
        require(keccak256(abi.encodePacked(_description)) != keccak256(abi.encodePacked("")), "please send a valid description");

        ssc.createNewBenefited(_benefited, _target, _description);

        ssc.listBenefitedPush(_benefited);
        emit NewBenefited(_benefited, _description, 0, _target);
    }

    function ReceiveDonations(address _benefited) external payable {
        require(ssc.getBenefited(_benefited).exists, "that address is not in the benefited list or the target was reached");
        ssc.addValueToDonators(msg.sender, msg.value);
        ssc.increaseCollected(_benefited, msg.value);
        
        this.transfer(msg.sender, 1 * 10 **18);


        emit NewDonation(msg.sender, _benefited, msg.value, ssc.getBenefited(_benefited).collected,ssc.getBenefited(_benefited).target);
        
        if (ssc.getBenefited(_benefited).collected >= ssc.getBenefited(_benefited).target){
            _transferAmount(_benefited);
        }

    }

    function CheckBenefited(address _benefited) public view returns (bool) {
        return ssc.getBenefited(_benefited).exists;
    }

    function GetAmountCollectedByAdr(address _benefited) external view returns (uint256){
        return ssc.getBenefited(_benefited).collected;
    }
    function GetAllBenefited()external view returns (address [] memory){
        return ssc.getAllBenefited();
    }

    function RemoveBenefited(address _benefited, bool _sendEth)public onlyOwner {
        require(CheckBenefited(_benefited), "benefited with that ID doesn't exist");
        if (_sendEth){
            payable(_benefited).transfer(ssc.getBenefited(_benefited).collected);
        }else{
            payable(deployer).transfer(ssc.getBenefited(_benefited).collected);
        }

        ssc.deleteBenefited(_benefited);
        
        emit RemovedBenefited(_benefited);
    }

    function CheckAmountDonatedByAdr(address _donator) external view returns(uint256){
        return ssc.returnDonator(_donator);
    }

     function GetBenefitedByAdr(address _adr) external view returns(bool, uint256, uint256, string memory){
        return (ssc.getBenefited(_adr).exists, ssc.getBenefited(_adr).collected, ssc.getBenefited(_adr).target, ssc.getBenefited(_adr).description);
    } 

    function _transferAmount(address _benefited) internal {
        RemoveBenefited(_benefited, true);
    }
     

    //create a function that receives 2 parameters: the address of the recipient and a bool

    





}