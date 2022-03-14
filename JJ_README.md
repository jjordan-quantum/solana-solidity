# `@solana/solidity - external contract calls`

The [Solang Compiler](https://github.com/hyperledger-labs/solang) compiles Solidity contracts to native Solana BPF programs.

This TypeScript library, inspired by [Ethers.js](https://github.com/ethers-io/ethers.js), can deploy and interact with Solidity contracts on Solana.

## Features

- Compile, load, and deploy Solidity contracts
- Redeploy and reuse existing contract programs
- Call contract functions to read and write data
- Subscribe to contract events and program logs

## Quick Setup

This is a short guide to deploying and interacting with the standard [ERC20](https://docs.openzeppelin.com/contracts/api/token/erc20) Solidity contract on Solana.
Assumes you already have docker, node and npm installed.  Requires docker is running.

1. Install dependencies.

```shell
npm install
```

2. Compile the contracts - this pulls the docker image for the solang compiler and executes a shell script to compile all the contracts in the examples directories, with artifacts being added to the respective output directories:

```shell
npm run build:test
```

3. Next decide whether you want to test with a local validator or deploy to devnet.

To deploy to devnet, create a .env file in the base directory and add the following line:

```shell
RPC_URL="https://api.devnet.solana.com"
```

To run tests against a local validator, the above line must NOT be present in the .env file, plus you need to start a local validator in a separate terminal using the following:

```shell
npm run validator
```

4. Run the ERC20 tests against the desired validator using the following command:

```shell
npm run test:erc20
```

note: the erc20-caller.test.ts is currently failing