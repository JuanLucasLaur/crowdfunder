export interface CampaignInfo {
    name: string;
    address: string;
    minimumContribution?: string;
    balance?: string;
    requestsCount?: string;
    approversCount?: string;
    manager?: string;
}

export interface Request {
    description: string;
    value: string;
    recipient: string;
    complete: boolean;
    approvalCount: string;
}
