import React from 'react';
import { GetStaticProps } from 'next';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import 'semantic-ui-css/semantic.min.css';

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
        <article>
            <h3>Open Campaigns</h3>
            {renderCampaigns()}
            <Button content="Create Campaign" icon="add" primary />
        </article>
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
