import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import {
    Button,
    Card,
    Message,
    Grid,
    StrictCardProps
} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import getCampaignContract from '../../ethereum/campaign';
import { fromWei } from 'web3-utils';
import { CampaignInfo } from '../../common/types';
import ContributeForm from '../../components/ContributeForm';

interface CampaignProps {
    campaignInfo: CampaignInfo | null;
}

export interface CampaignContext {
    [key: string]: string;
}

const Campaign: React.FunctionComponent<CampaignProps> = ({ campaignInfo }) => {
    const renderInfo = (campaign: CampaignInfo) => {
        const items: StrictCardProps[] = [
            {
                header: campaign.name,
                meta: campaign.address,
                description: 'Information about this campaign.'
            },
            {
                header: campaign.manager,
                meta: 'Address of the Campaign Manager',
                description:
                    'The manager created this campaign and can create requests to spend money.'
            },
            {
                header: campaign.minimumContribution,
                meta: 'Minimum Contribution (in wei)',
                description: 'Minimum amount of wei accepted as contribution.'
            },
            {
                header: campaign.requestsCount,
                meta: 'Number of spending requests',
                description:
                    'Spending requests are used by the campaign manager to withdraw money from the contract. Index must me approved by at least 51% of the contributors in order to be executed.'
            },
            {
                header: campaign.approversCount,
                meta: 'Number of contributors (approvers)',
                description:
                    'Number of people who have already donated to this campaign.'
            },
            {
                // @ts-expect-error
                header: fromWei(campaign.balance, 'ether'),
                meta: 'Campaign Balance (in ether)',
                description: 'How much money this campaign has.'
            }
        ];

        return (
            <Card.Group items={items} style={{ overflowWrap: 'break-word' }} />
        );
    };

    return (
        <Layout>
            {campaignInfo ? (
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={11}>
                            {renderInfo(campaignInfo)}
                        </Grid.Column>

                        <Grid.Column width={5}>
                            <ContributeForm address={campaignInfo.address} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link
                                href={`/campaigns/${campaignInfo.address}/requests`}
                            >
                                <a>
                                    <Button primary>View requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            ) : (
                <Message
                    error
                    content="An error occurred while fetching information about this campaign."
                    header="Could not fetch campaign information"
                />
            )}
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps<
    CampaignProps,
    CampaignContext
> = async ({ params }) => {
    try {
        // @ts-expect-error
        const campaign = getCampaignContract(params.address);
        const summary = await campaign.methods.getSummary().call();
        const campaignInfo: CampaignInfo = {
            // @ts-expect-error
            address: params.address,
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
