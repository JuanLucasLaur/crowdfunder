// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title Campaign
 * @dev Implements contributing to campaigns as well as creation, approval and execution of spending requests.
 */
contract Campaign {
    struct Request {
        string description; // Purpose of the request.
        uint value; // Amount of money to spend.
        address payable recipient; // Address that the money will be sent to.
        bool complete; // True if the request has already been executed.
        uint approvalCount; // Amount of approvals that the request has received.
        mapping(address => bool) approvals; // Addresses that approve the request.
    }

    Request[] public requests;
    address public manager;
    string public name;
    uint256 public minimumContribution;
    uint256 public approversCount;

    mapping(address => bool) public approvers;

    /** 
     * @dev Restrict a function so that only the campaign manager can invoke it.
     */
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    /** 
     * @dev Create a new Campaign.
     * @param minimum Minimum contribution allowed for the campaign.
     * @param creator Address of the Campaign's creator.
     */
    constructor(uint256 minimum, address creator, string memory campaignName) {
        manager = creator;
        minimumContribution = minimum;
        name = campaignName;
    }

    /** 
     * @dev Contribute to the Campaign.
     */
    function contribute() public payable {
        // Make sure that the contribution isn't below the minimum.
        require(msg.value >= minimumContribution);

        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;    
        }
    }

    /**
     * @dev Create a spending request.
     * @param description Why the request is being created.
     * @param value Amount of money to spend.
     * @param recipient Address that the money will be sent to.
     */
    function createRequest(string memory description, uint256 value, address payable recipient) public restricted {   
        // Make sure that the recipient address isn't the same that the address creating the request.
        require(msg.sender != recipient); 

        Request storage r = requests.push();
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }

    /**
     * @dev Approve a spending request.
     * @param index Index of the request to approve.
     */
    function approveRequest(uint256 index) public {
        Request storage requestToApprove = requests[index];

        // Make sure that the person trying to vote has contributed to the campaign.
        require(approvers[msg.sender]);

        // Make sure that the person trying hasn't voted yet.
        require(!requestToApprove.approvals[msg.sender]);

        requestToApprove.approvals[msg.sender] = true;
        requestToApprove.approvalCount++;
    }

    /**
     * @dev Execute a spending request.
     * @param index Index of the request to execute.
     */
    function finalizeRequest(uint256 index) public restricted {
        Request storage requestToExecute = requests[index];

        // Make sure that at least half of the contributors accept the request.
        require(requestToExecute.approvalCount > (approversCount / 2));

        // Make sure that the request hasn't been executed already.
        require(!requestToExecute.complete);

        requestToExecute.recipient.transfer(requestToExecute.value);
        requestToExecute.complete = true;
    }
}
