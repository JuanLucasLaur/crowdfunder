// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Campaign.sol";

/** 
 * @title CampaignFactory
 * @dev Allows creation and deployment of campaigns
 */
contract CampaignFactory {
    struct DeployedCampaign {
        Campaign campaignAddress; // Address of the deployed campaign.
        string campaignName; // Name of the deployed campaign.
    }

    DeployedCampaign[] public deployedCampaigns;

    /**
     * @dev Create a new Campaign.
     * @param minimum Minimum contribution allowed for the campaign.
     */
    function createCampaign(uint256 minimum, string memory campaignName) public {
        DeployedCampaign memory newCampaign = DeployedCampaign({
            campaignAddress: new Campaign(minimum, msg.sender, campaignName),
            campaignName: campaignName
        });

        deployedCampaigns.push(newCampaign);
    }


    /**
     * @dev Return all deployed campaigns.
     */
    function getDeployedCampaigns() public view returns (DeployedCampaign[] memory) {
        return deployedCampaigns;
    }
}
