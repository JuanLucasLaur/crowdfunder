import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from '../ethereum/factory';

type Campaign = {
    address: string;
    name: string;
};

interface IndexProps {
    campaigns: Campaign[];
}

const Index: React.FunctionComponent<IndexProps> = ({ campaigns }) => {
    const renderCampaigns = () => {
        const items = campaigns.map((campaign) => {
            return {
                header: campaign.name,
                meta: campaign.address,
                description: <a>View Campaign</a>,
                fluid: true
            };
        });

        return <Card.Group items={items} />;
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

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
    const fetchedCampaigns = await factory.methods
        .getDeployedCampaigns()
        .call();

    let campaigns: Campaign[];

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
