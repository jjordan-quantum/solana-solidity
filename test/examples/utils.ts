import { Connection, Keypair } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';
import { ABI, Contract, publicKeyToHex } from '../../src';
import * as dotenv from "dotenv";
dotenv.config();

const DEFAULT_URL = 'http://localhost:8899';
//const DEFAULT_URL = 'https://api.devnet.solana.com';

export async function loadContract(exampleDir: string, constructorArgs: any[] = [], name?: string, space = 8192 * 8) {
    const so = fs.readFileSync(path.join(exampleDir, './build/bundle.so'));

    let file: string;
    if (name) {
        file = `${name}.abi`;
    } else {
        file = fs.readdirSync(path.join(exampleDir, './build')).filter((n) => !~n.search('bundle.so'))[0];
        name = file.split('.abi')[0];
    }

    const abi = JSON.parse(fs.readFileSync(path.join(exampleDir, `./build/${file}`), 'utf-8')) as ABI;
    const connection = getConnection();
    const payer = await newAccountWithLamports(connection);
    const program = Keypair.generate();
    const storage = Keypair.generate();
    const contract = new Contract(connection, program.publicKey, storage.publicKey, abi, payer);

    await contract.load(program, so, payer);

    const payerETHAddress = publicKeyToHex(payer.publicKey);

    console.log('Deploying program to id: ' + program.publicKey);
    const { events } = await contract.deploy(name, constructorArgs, program, storage, space);

    console.log('Events from program deployment:');
    console.log(events);

    return {
        connection,
        payer,
        payerETHAddress,
        contract,
        abi,
        storage,
        events,
        program
    };
}

export async function loadCallerContract(exampleDir: string, payer: Keypair, connection: Connection, space = 8192) {
    const so = fs.readFileSync(path.join(exampleDir, './build/bundle.so'));

    const file = `ERC20Caller.abi`;
    /*
    if (name) {
        file = `ERC20Caller.abi`;
    } else {
        file = fs.readdirSync(path.join(exampleDir, './build')).filter((n) => !~n.search('bundle.so'))[0];
        name = file.split('.abi')[0];
    }
     */
    const name = "ERC20Caller";

    const abi = JSON.parse(fs.readFileSync(path.join(exampleDir, `./build/${file}`), 'utf-8')) as ABI;
    await airDrop(payer, connection);

    const program = Keypair.generate();
    const storage = Keypair.generate();

    const callerContract = new Contract(connection, program.publicKey, storage.publicKey, abi, payer);

    await callerContract.load(program, so, payer);

    const payerETHAddress = publicKeyToHex(payer.publicKey);

    console.log('Deploying program to id: ' + program.publicKey);
    const { events } = await callerContract.deploy(name, [], program, storage, space);

    console.log('Events from program deployment:');
    console.log(events);

    return {
        connection,
        payer,
        payerETHAddress,
        callerContract,
        abi,
        storage,
        events,
    };
}

export function getConnection(rpcUrl?: string): Connection {
    return new Connection(rpcUrl || process.env.RPC_URL || DEFAULT_URL, 'confirmed');
}

//export async function newAccountWithLamports(connection: Connection, lamports = 10000000000): Promise<Keypair> {
export async function newAccountWithLamports(connection: Connection, lamports = 2000000000): Promise<Keypair> {
    const account = Keypair.generate();

    console.log('Created account: ' + account.publicKey);
    console.log('Requesting airdrop for new account....');
    const signature = await connection.requestAirdrop(account.publicKey, lamports);
    await connection.confirmTransaction(signature, 'confirmed');

    return account;
}

export async function airDrop(account: Keypair, connection: Connection, lamports = 2000000000) {
    console.log('Requesting airdrop for account: ' + account.publicKey);
    const signature = await connection.requestAirdrop(account.publicKey, lamports);
    await connection.confirmTransaction(signature, 'confirmed');
}

export async function sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
