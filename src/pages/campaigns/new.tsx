import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

const New: React.FunctionComponent = () => {
    const [campaignName, setCampaignName] = useState('');
    const [minimumContribution, setMinimumContribution] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Handles new campaign form submittal.
     *
     * @param event {React.FormEvent}
     */
    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage('');

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(minimumContribution, campaignName)
                .send({
                    from: accounts[0]
                });
        } catch (error: any) {
            setErrorMessage(error.message);
        }

        setLoading(false);
    };

    return (
        <Layout>
            <h3>Create a Campaign</h3>

            <Form onSubmit={onSubmit} error={!!errorMessage}>
                <Form.Field>
                    <label>Campaign name</label>
                    <Input
                        onChange={(event) =>
                            setCampaignName(event.target.value)
                        }
                        value={campaignName}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Minimum contribution</label>
                    <Input
                        label="wei"
                        labelPosition="right"
                        onChange={(event) =>
                            setMinimumContribution(event.target.value)
                        }
                        value={minimumContribution}
                    />
                </Form.Field>

                <Message error header="Error" content={errorMessage} />
                <Button loading={loading} primary>Create Campaign</Button>
            </Form>
        </Layout>
    );
};

export default New;
