import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const FACTORY_ADDRESS = '0x99e7FefA27368f2a23b452d39275505c40d53be3';

const instance = new web3.eth.Contract(CampaignFactory.abi, FACTORY_ADDRESS);

export default instance;
