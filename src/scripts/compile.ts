import * as fs from "node:fs/promises";
import solc, { ContractInput } from "solc";
import "dotenv/config";

const contract = process.env["CONTRACT"];

async function main() {
  const sourceCode: string = await fs.readFile(
    `src/contracts/${contract}.sol`,
    "utf8"
  );
  console.log("Compiling...");
  const { abi, bytecode } = compile(sourceCode, contract);
  console.log(`Writing compiled files...`);
  const artifact = JSON.stringify({ abi, bytecode }, null, 2);
  await fs.mkdir("dist/contracts", { recursive: true });
  await fs.writeFile(`dist/contracts/${contract}.json`, artifact);
}

function compile(sourceCode: string, name: string) {
  const input: ContractInput = {
    language: "Solidity",
    sources: { main: { content: sourceCode } },
    settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
  };
  const output = solc.compile(JSON.stringify(input));
  const artifact = JSON.parse(output).contracts.main[name];
  return {
    abi: artifact.abi,
    bytecode: artifact.evm.bytecode.object,
  };
}

(async () => {
  await main();
})();

export default main;
