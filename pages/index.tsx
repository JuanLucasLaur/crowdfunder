import React from 'react';
import factory from '../ethereum/factory';
import { GetStaticProps } from 'next';

interface IndexProps {
    campaignAddresses?: string[];
}

const Index: React.FunctionComponent<IndexProps> = ({ campaignAddresses }) => {
    console.log(campaignAddresses);

    return (
        <article>
            <h2>Campaigns index</h2>
            {campaignAddresses}
        </article>
    );
};

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
    const campaignAddresses = await factory.methods.getDeployedCampaigns().call();

    return {
        props: {
            campaignAddresses
        }
    };
};

export default Index;
