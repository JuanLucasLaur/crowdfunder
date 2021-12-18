import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const FACTORY_ADDRESS = '0xd15646c9d5a0ebef1cf743e9fa11401057CB2C35';

const instance = new web3.eth.Contract(CampaignFactory.abi, FACTORY_ADDRESS);

export default instance;
