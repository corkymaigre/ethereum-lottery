import ganache from "ganache";
import * as fs from "fs";
import { Contract, Web3 } from "web3";
import { RegisteredSubscription } from "web3/lib/commonjs/eth.exports";
import { Abi } from "solc";

import compile from "../src/scripts/compile";

const MESSAGE = "demo";

const name = process.env["CONTRACT"];

const web3: Web3<RegisteredSubscription> = new Web3(ganache.provider());
let accounts: string[];
let contract: Contract<Abi>;

beforeAll(async () => {
  await compile();
});

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  const { abi, bytecode } = JSON.parse(
    fs.readFileSync(`dist/contracts/${name}.json`) as unknown as string
  );

  const args = [MESSAGE];
  contract = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery", () => {
  it("should deploy a contract", () => {
    expect(contract.options.address).toBeDefined();
  });

  it("should allow one account to enter", async () => {
    await contract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    const players: string[] = await contract.methods.getPlayers().call({
      from: accounts[0],
    });
    expect(players.length).toBe(1);
    expect(players[0]).toEqual(accounts[0]);
  });

  it("should allow multiple accounts to enter", async () => {
    await contract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await contract.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await contract.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });
    const players: string[] = await contract.methods.getPlayers().call({
      from: accounts[0],
    });
    expect(players.length).toBe(3);
    expect(players[0]).toEqual(accounts[0]);
    expect(players[1]).toEqual(accounts[1]);
    expect(players[2]).toEqual(accounts[2]);
  });

  it("should require a minimum amount of ether to enter", async () => {
    try {
      await contract.methods.enter().send({
        from: accounts[0],
        value: "0",
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it("should restrict picking winner to the owner only", async () => {
    try {
      await contract.methods.pickWinner().send({
        from: accounts[1],
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it("should send money to the winner and reset the players", async () => {
    await contract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether"),
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await contract.methods.pickWinner().send({
      from: accounts[0],
    });

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;

    expect(difference).toBeGreaterThan(
      Number(web3.utils.toWei("1.8", "ether"))
    );
  });
});
