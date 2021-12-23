import React from 'react';
import { GetServerSideProps } from 'next';
import { Card, Message, StrictCardProps } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import getCampaignContract from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import { CampaignInfo } from '../../common/types';

interface CampaignProps {
    campaignInfo: CampaignInfo | null;
}

interface CampaignContext {
    [key: string]: 'address';
}

const Campaign: React.FunctionComponent<CampaignProps> = ({ campaignInfo }) => {
    const renderInfo = () => {
        let render: JSX.Element;

        if (campaignInfo) {
            const items: StrictCardProps[] = [
                {
                    header: campaignInfo.name,
                    meta: campaignInfo.address,
                    description: 'Information about this campaign.'
                },
                {
                    header: campaignInfo.manager,
                    meta: 'Address of the Campaign Manager',
                    description:
                        'The manager created this campaign and can create requests to spend money.'
                },
                {
                    header: campaignInfo.minimumContribution,
                    meta: 'Minimum Contribution (in wei)',
                    description:
                        'Minimum amount of wei accepted as contribution.'
                },
                {
                    header: campaignInfo.requestsCount,
                    meta: 'Number of spending requests',
                    description:
                        'Spending requests are used by the campaign manager to withdraw money from the contract. Requests must me approved by at least 51% of the contributors in order to be executed.'
                },
                {
                    header: campaignInfo.approversCount,
                    meta: 'Number of contributors (approvers)',
                    description:
                        'Number of people who have already donated to this campaign.'
                },
                {
                    header: web3.utils.fromWei(campaignInfo.balance, 'ether'),
                    meta: 'Campaign Balance (in ether)',
                    description: 'How much money this campaign has.'
                }
            ];

            render = (
                <Card.Group
                    items={items}
                    style={{ overflowWrap: 'break-word' }}
                />
            );
        } else {
            render = (
                <Message
                    error
                    content="An error occurred while fetching information about this campaign."
                    header="Could not fetch campaign information"
                />
            );
        }

        return render;
    };

    return <Layout>{renderInfo()}</Layout>;
};

export const getServerSideProps: GetServerSideProps<
    CampaignProps,
    CampaignContext
> = async ({ params }) => {
    try {
        const campaign = getCampaignContract(params?.address);
        const summary = await campaign.methods.getSummary().call();
        const campaignInfo: CampaignInfo = {
            address: params?.address,
            name: summary[0],
            minimumContribution: summary[1],
            balance: summary[2],
            requestsCount: summary[3],
            approversCount: summary[4],
            manager: summary[5]
        };
        return {
            props: {
                campaignInfo,
                error: false
            }
        };
    } catch (error) {
        return {
            props: {
                campaignInfo: null
            }
        };
    }
};

export default Campaign;
