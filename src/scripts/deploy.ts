import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import * as fs from "fs";
import "dotenv/config";

import compile from "./compile";

const name = process.env["CONTRACT"];

async function main() {
  const provider = new HDWalletProvider(
    process.env["SEED_PHRASE"],
    process.env["GOERLI_ADDRESS"]
  );

  const web3 = new Web3(provider as any);
  const accounts = await web3.eth.getAccounts();

  await compile();

  const { abi, bytecode } = JSON.parse(
    fs.readFileSync(`dist/contracts/${name}.json`) as unknown as string
  );

  console.log(`Attempting to deploy from ${accounts[0]}`);

  const contract = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  console.log(`Contract deployed to ${contract.options.address}`);

  provider.engine.stop();
}

(async () => {
  await main();
})();

export default main;
