import { LogDescription } from '@ethersproject/abi';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import expect from 'expect';

import { Contract, publicKeyToHex } from '../../../src';
import { loadContract, loadCallerContract } from '../utils';

const NAME = 'Solana';
const SYMBOL = 'SOL';
const TOTAL_SUPPLY = 10000;

describe('ERC20', () => {
    let contract: Contract;
    let payerETHAddress: string;
    let callerContract: Contract;
    let payer: Keypair;
    let connection: Connection;
    let program: Keypair;
    let tokenProgramId: PublicKey;

    it('deploys token contract', async function () {
        this.timeout(150000);
        ({ contract, payerETHAddress, payer, connection, program } = await loadContract(__dirname, [NAME, SYMBOL, TOTAL_SUPPLY]));
        tokenProgramId = program.publicKey;
        expect(!!(contract)).toEqual(true);
        expect(!!(tokenProgramId)).toEqual(true);
    });

    it('deploys an ERC20Caller contract', async function () {
        this.timeout(150000);

        ({ callerContract } = await loadCallerContract(__dirname, payer, connection));

        expect(!!(callerContract)).toEqual(true);
    });

    it('calls an external ERC20 contract with a mutating function using selector', async function () {
        this.timeout(150000);

        callerContract = new Contract(
            callerContract.connection,
            callerContract.program,
            callerContract.storage,
            callerContract.abi,
            callerContract.payer
        );

        const tokenAccount = publicKeyToHex(tokenProgramId);
        const spenderAccount = publicKeyToHex(Keypair.generate().publicKey);
        const spendAmount = 9;

        const result = await callerContract.callERC20ApproveWithSelector(tokenAccount, spenderAccount, spendAmount);

        expect(result).toEqual(true);
    });
});
