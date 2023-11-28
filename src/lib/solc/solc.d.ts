declare module "solc" {
  export interface Abi {
    inputs: any[];
    name: string;
    outputs: any[];
    stateMutability: "view" | "nonpayable";
    type: string;
  }

  export interface Devdoc {
    kind: "dev";
    methods: {};
    version: number;
  }
  export interface Bytecode {
    functionDebugData: Object[];
    generatedSources: [];
    linkReferences: {};
    object: string;
    opcodes: string;
    sourceMap: string;
  }

  export interface GasEstimates {
    creation: Object;
    external: Object;
  }

  export interface LegacyAssembly {
    ".code": any[];
    ".data": any[];
    sourceList: any[];
  }

  export interface MethodIdentifiers {
    "message()": string;
    "setMessage(string)": string;
  }

  export interface Evm {
    assembly: string;
    bytecode: Bytecode;
    deployedBytecode: Bytecode;
    gasEstimates: GasEstimates;
    legacyAssembly: LegacyAssembly;
    methodIdentifiers: MethodIdentifiers;
  }

  export interface Ewasm {
    wasm: string;
  }

  export interface StorageLayout {
    storage: Object[];
    types: { t_string_storage: Object };
  }

  export interface Userdoc {
    kind: "user";
    methods: {};
    version: number;
  }

  export interface Contract {
    abi: Abi[];
    devdoc: Devdoc;
    evm: Evm;
    ewasm: Ewasm;
    metadata: string;
    storageLayout: StorageLayout;
    userdoc: Userdoc;
  }

  export interface CompiledContract {
    contracts: {
      [key: string]: {
        [key: string]: Contract;
      };
    };
  }

  export interface ContractInput {
    language: "Solidity";
    sources: {
      [key: string]: {
        content: string;
      };
    };
    settings: {
      outputSelection: { [key: string]: { [key: string]: string[] } };
    };
  }

  export function compile(
    contract: Stringified<ContractInput>
  ): Stringified<CompiledContract>;
}
