const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const campaignFactoryBuild = require('../src/ethereum/build/CampaignFactory.json');
const campaignBuild = require('../src/ethereum/build/Campaign.json');

const MANAGER_ADDRESS = 0;
const MINIMUM_CONTRIBUTION = 100;

let accounts;
let campaignFactory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    // Deploy CampaignFactory.
    campaignFactory = await new web3.eth.Contract(campaignFactoryBuild.abi)
        .deploy({data: campaignFactoryBuild.evm.bytecode.object})
        .send({from: accounts[MANAGER_ADDRESS], gas: '2000000'});

    // Create a Campaign.
    await campaignFactory.methods.createCampaign(MINIMUM_CONTRIBUTION, 'Test campaign').send({
        from: accounts[MANAGER_ADDRESS],
        gas: '2000000'
    });

    // Access the Campaign that was created.
    [{ campaignAddress }] = await campaignFactory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        campaignBuild.abi,
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a CampaignFactory and a Campaign', () => {
        assert.ok(campaignFactory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();

        assert.strictEqual(accounts[MANAGER_ADDRESS], manager);
    });

    it('allows people to contribute and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: MINIMUM_CONTRIBUTION.toString(10),
            from: accounts[1]
        })

        const isApprover = await campaign.methods.approvers(accounts[1]).call();
        assert(isApprover);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: (MINIMUM_CONTRIBUTION - 1).toString(10),
                from: accounts[1]
            });
        } catch (error) {
            assert(error);
            return;
        }
        assert(false);
    });

    it('allows the manager to create a payment request', async () => {
        const requestDescription = 'Test request';

        await campaign.methods.createRequest(requestDescription, '2000', accounts[9]).send({
            from: accounts[MANAGER_ADDRESS],
            gas: '2000000'
        });
        const request = await campaign.methods.requests(0).call();

        assert.strictEqual(requestDescription, request.description);
    });

    it('processes requests', async () => {
        const recipientAddress = 9;
        const ethToPay = 5;

        // Create spending request.
        await campaign.methods.createRequest(
            'Test request',
            web3.utils.toWei(ethToPay.toString(), 'ether'),
            accounts[recipientAddress]
        ).send({
            from: accounts[MANAGER_ADDRESS],
            gas: '2000000'
        });

        // Add a contributor/approver .
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10', 'ether')
        });

        // Make the contributor approve the test request.
        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '2000000'
        });

        // Get recipient's balance before being paid.
        let recipientInitialBalance = await web3.eth.getBalance(accounts[recipientAddress]);
        recipientInitialBalance = web3.utils.fromWei(recipientInitialBalance, 'ether');
        recipientInitialBalance = parseFloat(recipientInitialBalance);

        // Make the campaign manager approve the test request.
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '2000000'
        })

        // Get recipient's balance after being paid.
        let recipientFinalBalance = await web3.eth.getBalance(accounts[recipientAddress]);
        recipientFinalBalance = web3.utils.fromWei(recipientFinalBalance, 'ether');
        recipientFinalBalance = parseFloat(recipientFinalBalance);

        // Check that recipient's balance is increased by an amount (approximately) equal to the amount of eth to pay.
        assert(recipientFinalBalance > (recipientInitialBalance + (ethToPay - 0.25)));
    });
});
