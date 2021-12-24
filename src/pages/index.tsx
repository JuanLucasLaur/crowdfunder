import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { Button, Card, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from '../ethereum/factory';
import { CampaignInfo } from '../common/types';

interface IndexProps {
    campaigns: CampaignInfo[];
}

const Index: React.FunctionComponent<IndexProps> = ({ campaigns }) => {
    const renderCampaigns = () => {
        let render: JSX.Element;

        if (campaigns.length) {
            const items = campaigns.map((campaign) => {
                return {
                    header: campaign.name,
                    meta: campaign.address,
                    description: (
                        <Link href={`/campaigns/${campaign.address}`}>
                            <a>View Campaign</a>
                        </Link>
                    ),
                    fluid: true
                };
            });

            render = <Card.Group items={items} />;
        } else {
            render = (
                <Message
                    info
                    compact
                    content="There are no campaigns, but you can create one."
                    header="No campaigns"
                />
            );
        }

        return render;
    };

    return (
        <Layout>
            <article>
                <h3>Open Campaigns</h3>
                <Link href="/campaigns/new">
                    <a>
                        <Button
                            content="Create Campaign"
                            icon="add"
                            floated="right"
                            primary
                        />
                    </a>
                </Link>
                {renderCampaigns()}
            </article>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const fetchedCampaigns = await factory.methods
        .getDeployedCampaigns()
        .call();

    let campaigns: CampaignInfo[];

    if (fetchedCampaigns?.length) {
        campaigns = fetchedCampaigns.map((fetchedCampaign: any) => {
            return {
                address: fetchedCampaign.campaignAddress,
                name: fetchedCampaign.campaignName
            };
        });
    } else {
        campaigns = [];
    }

    return {
        props: {
            campaigns
        }
    };
};

export default Index;
