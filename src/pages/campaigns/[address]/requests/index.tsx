import React from 'react';
import Link from 'next/link';
import { Button } from 'semantic-ui-react';
import Layout from '../../../../components/Layout';
import { GetServerSideProps } from 'next';
import { CampaignContext } from '../../[address]';

export interface RequestsProps {
    address: string;
}

const Requests: React.FunctionComponent<RequestsProps> = ({ address }) => {
    return (
        <Layout>
            Requests page
            <Link href={`/campaigns/${address}/requests/new`}>
                <a>
                    <Button primary>Add request</Button>
                </a>
            </Link>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps<
    RequestsProps,
    CampaignContext
> = async ({ params }) => {
    return {
        props: {
            // @ts-expect-error
            address: params.address
        }
    };
};

export default Requests;
