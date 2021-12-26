import React from 'react';
import { Button, TableRow, TableCell } from 'semantic-ui-react';
import { fromWei } from 'web3-utils';
import { Request } from '../common/types';
import web3 from '../ethereum/web3';
import getCampaignContract from '../ethereum/campaign';

interface RequestRowProps {
    address: string;
    approversCount: string;
    id: number;
    isManager: boolean;
    loading: boolean;
    request: Request;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const RequestRow: React.FunctionComponent<RequestRowProps> = ({
    address,
    approversCount,
    id,
    isManager,
    loading,
    request,
    setErrorMessage,
    setLoading
}) => {
    const readyToFinalize =
        parseInt(request.approvalCount) > parseInt(approversCount) / 2;

    const onApprove = async () => {
        setLoading(true);
        setErrorMessage('');

        const campaign = getCampaignContract(address);
        const accounts = await web3.eth.getAccounts();

        try {
            await campaign.methods.approveRequest(id).send({
                from: accounts[0]
            });
        } catch (error: any) {
            setErrorMessage(error.message);
        }
        setLoading(false);
    };

    const onFinalize = async () => {
        setLoading(true);
        setErrorMessage('');

        const campaign = getCampaignContract(address);
        const accounts = await web3.eth.getAccounts();

        try {
            await campaign.methods.finalizeRequest(id).send({
                from: accounts[0]
            });
        } catch (error: any) {
            setErrorMessage(error.message);
        }
        setLoading(false);
    };

    return (
        <TableRow
            disabled={request.complete}
            positive={!request.complete && readyToFinalize}
        >
            <TableCell>{id}</TableCell>
            <TableCell>{request.description}</TableCell>
            <TableCell>{fromWei(request.value, 'ether')} eth</TableCell>
            <TableCell>{request.recipient}</TableCell>
            <TableCell>
                {request.approvalCount}/{approversCount}
            </TableCell>
            <TableCell>
                {request.complete ? null : (
                    <Button
                        onClick={onApprove}
                        loading={loading}
                        color="green"
                        basic
                    >
                        Approve
                    </Button>
                )}
            </TableCell>
            {isManager && (
                <TableCell>
                    {request.complete ? (
                        <div style={{ textAlign: 'center' }}>&#x2713;</div>
                    ) : (
                        <Button
                            onClick={onFinalize}
                            loading={loading}
                            color="teal"
                            basic
                        >
                            Finalize
                        </Button>
                    )}
                </TableCell>
            )}
        </TableRow>
    );
};

export default RequestRow;
