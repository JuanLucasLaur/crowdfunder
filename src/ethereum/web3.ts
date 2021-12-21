/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import Web3 from 'web3';
import keys from './config/keys';

let web3: Web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // We are in the browser and metamask is running.
    window.ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(window.ethereum);
} else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(keys.INFURA_API);
    web3 = new Web3(provider);
}

export default web3;
