import React, { useEffect, useState } from 'react';
import factory from '../ethereum/factory';

const Index: React.FunctionComponent = () => {
    const [campaigns, setCampaigns] = useState<string[]>([]);

    useEffect(() => {
        const getDeployedCampaigns = async () => {
            const fetchedCampaigns = await factory.methods
              .getDeployedCampaigns()
              .call();

            setCampaigns(fetchedCampaigns);
        };

        getDeployedCampaigns();
    }, []);

    return (
      <article>
          <h2>Campaigns index</h2>
          {campaigns}
      </article>
    );
};

export default Index;
