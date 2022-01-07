# Crowdfunder

Crowdfunding website written with React.js and Typescript, using smart contracts coded in Solidity. The site interacts with the contracts using web3.js .

## Installation

The project is written using next.js. After cloning it or downloading it you should install the project's dependencies using `npm install` .

To deploy the contract, an Infura API link and key are necessary — these should be exported from the `src/ethereum/config/~dev.js` file. Once the keys are set run `npm run compile` to compile the smart contract and then `npm run deploy` to deploy it to the Ethereum network (this might cost money, so deploy it to a test network).

The project can then be started using `npm run dev`.

### Other dependencies

This project uses ESLint for linting and Prettier for code formatting.

## Other scripts

There are other commands available besides `npm run dev`:

`npm run compile`: Compiles the solidity contract.

`npm run deploy`: Deploys the compiled solidity contract to the Ethereum network (this might cost money, so deploy it to a test network).

`npm run build`: Builds the application for production usage.

`npm run start`: Starts a production server.

`npm run lint`: Runs ESLint for all files in the `src/pages` and `src/components` directories.

`npm run test`: Runs all tests in the `test` directory. The tests are written using mocha.

## Credits

Based on [Stephen Grider's Ethereum and Solidity course](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/).
