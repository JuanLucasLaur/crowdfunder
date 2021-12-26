import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Button, Message, Table } from 'semantic-ui-react';
import { CampaignContext } from '../../[address]';
import Layout from '../../../../components/Layout';
import RequestRow from '../../../../components/RequestRow';
import getCampaignContract from '../../../../ethereum/campaign';
import { Request } from '../../../../common/types';
import web3 from '../../../../ethereum/web3';

interface RequestsProps {
    address: string;
    approversCount: string;
    manager: string;
    requests: Request[];
}

const Requests: React.FunctionComponent<RequestsProps> = ({
    address,
    approversCount,
    manager,
    requests
}) => {
    const [isManager, setIsManager] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        web3.eth.getAccounts().then(([account]) => {
            if (account === manager) setIsManager(true);
        });
    }, [manager]);

    /**
     * Renders a row displaying a spending request.
     */
    const renderRow = () => {
        return requests.map((request: any, index: number) => {
            return (
                <RequestRow
                    address={address}
                    approversCount={approversCount}
                    id={index}
                    isManager={isManager}
                    loading={loading}
                    request={request}
                    setErrorMessage={setErrorMessage}
                    setLoading={setLoading}
                    key={index}
                />
            );
        });
    };

    return (
        <Layout>
            <h3>Requests</h3>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Recipient</Table.HeaderCell>
                        <Table.HeaderCell>Approval Count</Table.HeaderCell>
                        <Table.HeaderCell>Approve</Table.HeaderCell>
                        {isManager && (
                            <Table.HeaderCell>Finalize</Table.HeaderCell>
                        )}
                    </Table.Row>
                </Table.Header>
                <Table.Body>{renderRow()}</Table.Body>
            </Table>
            {!!errorMessage && (
                <Message error header="Error" content={errorMessage} />
            )}
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
    // @ts-expect-error
    const campaign = getCampaignContract(params.address);
    const requestsCount = parseInt(
        await campaign.methods.getRequestsCount().call()
    );
    const approversCount = await campaign.methods.approversCount().call();
    const manager = await campaign.methods.manager().call();

    let requests = await Promise.all(
        // Create an array of integers from zero up to requestCount and map over it.
        [...Array(requestsCount)].map((element, index) => {
            return campaign.methods.requests(index).call();
        })
    );
    requests = requests.map((element) => {
        return { ...element };
    });

    return {
        props: {
            // @ts-expect-error
            address: params.address,
            approversCount,
            manager,
            requests
        }
    };
};

export default Requests;
