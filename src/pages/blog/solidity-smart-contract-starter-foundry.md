---
layout: '../../layouts/BlogLayout.astro'
title: 'Solidity SmartContract Starter: Test and Deploy with Foundry'
date: '2023-04-07'
description:
  'A couple of tips to reduce gas consumption in your smart contracts, from
  pre-incrementing to caching array length.'
category: 'Web3'
author: 'Adarsh'
---

# Solidity SmartContract Starter: Test and Deploy with Foundry

> With Foundry, you can easily create, test, and deploy Solidity smart contracts
> on the Ethereum blockchain. Say goodbye to complex setups and tedious
> configurations, and say hello to a simplified and efficient process that
> enables you to focus on writing robust smart contracts and bringing your
> decentralized applications (DApps) to life.

## Introduction

In this write-up, we will explore the key features of Foundry and how it can
benefit Solidity developers in their smart contract development journey. Foundry
is a smart contract development toolchain. Foundry manages your dependencies,
compiles your project, runs tests, deploys, and lets you interact with the chain
from the command-line and via Solidity scripts. See the
[Foundry Installation guide](https://book.getfoundry.sh/getting-started/installation)
to get started.

## Part of the Foundry Toolkit

- **Forge** — A command-line tool that ships with Foundry. Forge tests, builds,
  and deploys your smart contracts.
- **Cast** — Foundry's command-line tool for performing Ethereum RPC calls. You
  can make smart contract calls, send transactions, or retrieve any type of
  chain data — all from your command-line.
- **Anvil** — A local testnet node shipped with Foundry. You can use it for
  testing your contracts from frontends or for interacting over RPC.

## Setting Up the Project

Create a new Foundry project using `forge`:

```bash
forge init contract
```

Then navigate into the project:

```bash
cd contract
ls
```

You'll see four directories:

```
.
├── lib
├── script
├── src
└── test
```

Smart contracts are written inside the `src` folder.

## Adding Dependencies

Use `forge install` to add dependencies:

```bash
forge install transmissions11/solmate
forge install openzeppelin/openzeppelin-contracts
```

## Creating the Contract

Create a simple Solidity contract inside `src/` that allows users to update a
message and view the previous one:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Message {
    string public current_message;
    string public previous_message;

    function ChangeMessage(string calldata _message) public {
        previous_message = current_message;
        current_message = _message;
    }
}
```

### Code Walkthrough

`// SPDX-License-Identifier: MIT` — Indicates the contract is released under the
MIT open-source license.

`pragma solidity ^0.8.19;` — Specifies that Solidity version 0.8.19 or higher is
required to compile the contract.

`string public current_message;` — A public state variable that stores the
current message.

`string public previous_message;` — A public state variable that stores the
previous message.

`ChangeMessage(string calldata _message)` — A public function that updates
`current_message` with the new value and saves the old value to
`previous_message`, allowing users to track changes.

## Building the Project

Build the project with:

```bash
forge build
```

Expected output:

```
[⠰] Compiling...
[⠒] Compiling 21 files with 0.8.19
[⠒] Solc 0.8.19 finished in 6.10s
Compiler run successful
```

Two new directories will appear after a successful build:

- **`out/`** — Contains your contract artifacts, such as the ABI.
- **`cache/`** — Used by Forge to avoid recompiling unchanged files.

## Writing Tests

Forge runs tests with the `forge test` command. All tests are written in
Solidity. Forge automatically identifies any function prefixed with `test` as a
test case. By convention, tests are placed in the `test/` directory and end with
`.t.sol`.

Create a test file in `test/Message.t.sol`:

```solidity
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Message.sol";

contract MessageTest is Test {
    Message public message;

    function setUp() public {
        message = new Message();
    }

    function testChange() public {
        message.ChangeMessage("First");
        message.ChangeMessage("Second");
        assertEq(message.current_message(), "Second");
        assertEq(message.previous_message(), "First");
    }
}
```

### Test Code Walkthrough

`import "forge-std/Test.sol";` — Imports the Forge standard library, which
provides testing utilities.

`import "../src/Message.sol";` — Imports the contract being tested.

`contract MessageTest is Test` — Declares the test contract, inheriting Forge's
`Test` utilities.

`setUp()` — An optional function that runs before each test case. Here it
creates a fresh `Message` instance.

`testChange()` — Calls `ChangeMessage` twice, then uses `assertEq` to verify
that `current_message` is `"Second"` and `previous_message` is `"First"`.

Run the tests:

```bash
forge test
```

Expected output:

```
[⠔] Compiling...
[⠊] Compiling 1 files with 0.8.19
[⠢] Solc 0.8.19 finished in 2.41s
Compiler run successful
Running 1 test for test/Message.t.sol:MessageTest
[PASS] testChange() (gas: 58905)
Test result: ok. 1 passed; 0 failed; finished in 1.17ms
```

## Gas Reports

Forge can produce gas reports for your contracts. Configure which contracts
generate reports in `foundry.toml`:

```toml
gas_reports = ["MyContract", "MyContractFactory"]
```

To report on all contracts:

```toml
gas_reports = ["*"]
```

Generate a gas report with:

```bash
forge test --gas-report
```

Example output:

```
Running 1 test for test/Message.t.sol:MessageTest
[PASS] testChange() (gas: 58905)
Test result: ok. 1 passed; 0 failed; finished in 18.42ms

| src/Message.sol:Message contract |                 |       |        |       |         |
|----------------------------------|-----------------|-------|--------|-------|---------|
| Deployment Cost                  | Deployment Size |       |        |       |         |
| 227669                           | 1169            |       |        |       |         |
| Function Name                    | min             | avg   | median | max   | # calls |
| ChangeMessage                    | 21780           | 23724 | 23724  | 25669 | 2       |
| current_message                  | 1169            | 1169  | 1169   | 1169  | 1       |
| previous_message                 | 1191            | 1191  | 1191   | 1191  | 1       |
```

## Anvil — Local Testnet Node

Anvil is a local testnet node that ships with Foundry. It is installed alongside
`forge`, `cast`, and `chisel`. Start it with:

```bash
anvil
```

## Deploying the Contract

Use `forge create` to deploy a contract to a network. You must provide an RPC
URL and the private key of the deploying account. The example below deploys to
the local Anvil node:

```bash
forge create \
  --rpc-url "http://127.0.0.1:8545" \
  --private-key "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" \
  src/Message.sol:Message
```

> Note: The `:Message` suffix specifies which contract to deploy when a Solidity
> file contains multiple contracts.

Expected output:

```
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Transaction hash: 0xfd6b8716c0b3498ef20228eb5317029381423960d7081d14f4386d63fd6718c6
```

To deploy to a testnet or mainnet, replace the private key with your wallet's
private key and use a real RPC URL. See
[Best RPC Providers](https://www.alchemy.com/best/rpc-node-providers) for
options.

For full documentation, refer to the
[Foundry Book](https://book.getfoundry.sh/).

---

> If you spot any mistakes or have any feedback, please feel free to point them
> out.
