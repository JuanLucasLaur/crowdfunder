import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const FACTORY_ADDRESS = '0xecae0Dbd5b51586daC76b928bF936aB4025E9c1b';

const instance = new web3.eth.Contract(CampaignFactory.abi, FACTORY_ADDRESS);

export default instance;
