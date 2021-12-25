import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import getCampaignContract from '../ethereum/campaign';

interface ContributeFormProps {
    address: string;
}

const ContributeForm: React.FunctionComponent<ContributeFormProps> = ({
    address
}) => {
    const [value, setValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    /**
     * Handles contribution form submittal.
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
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether')
            });
            router.replace(`/campaigns/${address}`);
        } catch (error: any) {
            setErrorMessage(error.message);
        }

        setValue('');
        setLoading(false);
    };

    return (
        <Form onSubmit={onSubmit} error={!!errorMessage}>
            <Form.Field>
                <label>Amount to contribute</label>
                <Input
                    label="ether"
                    labelPosition="right"
                    onChange={(event) => setValue(event.target.value)}
                    value={value}
                />
            </Form.Field>

            <Message error header="Error" content={errorMessage} />
            <Button loading={loading} primary>
                Contribute
            </Button>
        </Form>
    );
};

export default ContributeForm;
