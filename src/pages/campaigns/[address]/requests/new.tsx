import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Input, Message, Form } from 'semantic-ui-react';
import { CampaignContext } from '../../[address]';
import Layout from '../../../../components/Layout';
import getCampaignContract from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';

interface NewRequestsProps {
    address: string;
}

const NewRequestForm: React.FunctionComponent<NewRequestsProps> = ({
    address
}) => {
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [recipient, setRecipient] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    /**
     * Handles new spending request form submittal.
     *
     * @param {React.FormEvent} event
     */
    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage('');

        const campaign = getCampaignContract(address);

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(
                    description,
                    web3.utils.toWei(value, 'ether'),
                    recipient
                )
                .send({ from: accounts[0] });
            router.push(`/campaigns/${address}/requests`);
        } catch (error: any) {
            setErrorMessage(error.message);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <h3>Create a spending request</h3>
            <Form onSubmit={onSubmit} error={!!errorMessage}>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value);
                        }}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Value</label>
                    <Input
                        label="ether"
                        labelPosition="right"
                        value={value}
                        onChange={(event) => {
                            setValue(event.target.value);
                        }}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input
                        value={recipient}
                        onChange={(event) => {
                            setRecipient(event.target.value);
                        }}
                    />
                </Form.Field>

                <Message error header="Error" content={errorMessage} />
                <Button loading={loading} primary>
                    Create request
                </Button>
                <Link href={`/campaigns/${address}/requests`}>
                    <a>
                        <Button>Back</Button>
                    </a>
                </Link>
            </Form>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps<
    NewRequestsProps,
    CampaignContext
> = async ({ params }) => {
    return {
        props: {
            // @ts-expect-error
            address: params.address
        }
    };
};

export default NewRequestForm;
