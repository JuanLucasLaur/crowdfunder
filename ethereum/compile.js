const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// Clean previous build.
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// Read source code.
const campaignFactoryPath = path.resolve(__dirname, 'contracts', 'CampaignFactory.sol');
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const campaignFactorySource = fs.readFileSync(campaignFactoryPath, 'utf8');
const campaignSource = fs.readFileSync(campaignPath, 'utf8');

// Compile contracts.
const input = {
    language: 'Solidity',
    sources: {
        'CampaignFactory.sol': {
            content: campaignFactorySource
        },
        'Campaign.sol': {
            content: campaignSource
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode']
            }
        }
    }
};
const output = JSON.parse(solc.compile(JSON.stringify(input)));
fs.ensureDirSync(buildPath);

// Loop over output and write each contract to a different file.
if (output.errors) {
    output.errors.forEach((error) => {
        throw new Error(error.formattedMessage);
    });
} else {
    Object.values(output.contracts).forEach(contract => {
        Object.entries(contract).forEach(([contractName, contractProps]) => {
            fs.writeFileSync(
                path.resolve(buildPath, `${contractName}.json`),
                JSON.stringify(contractProps),
                'utf8'
            );
        });
    });
}
