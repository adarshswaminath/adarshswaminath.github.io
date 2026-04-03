---
layout: "../../layouts/BlogLayout.astro"
title: "Solidity SmartContract Starter: Test and Deploy with Foundry"
date: "2023-04-07"
description: "A couple of tips to reduce gas consumption in your smart contracts, from pre-incrementing to caching array length."
category: "Web3"
author: "Adarsh"
---


Solidity SmartContract Starter: Test and Deploy with Foundry
============================================================

[![Adarshswaminath](https://miro.medium.com/v2/da:true/resize:fill:64:64/0*fkvFuo34WNeXdIEE)](https://medium.com/@adarshswaminath7?source=post_page---byline--1a0bc8f4f916---------------------------------------)

[Adarshswaminath](https://medium.com/@adarshswaminath7?source=post_page---byline--1a0bc8f4f916---------------------------------------)

7 min read

·

Apr 7, 2023

--

Listen

Share

> With Foundry, you can easily create, test, and deploy Solidity smart contracts on the Ethereum blockchain. Say goodbye to complex setups and tedious configurations, and say hello to a simplified and efficient process that enables you to focus on writing robust smart contracts and bringing your decentralized applications (DApps) to life

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*X5JnJUzf0bkUAxxkB0MZ6g.png)

Introduction
------------

In this Medium write-up, we will explore the key features of Foundry and how it can benefit Solidity developers in their smart contract development journey.Foundry is a smart contract development toolchain.Foundry manages your dependencies, compiles your project, runs tests, deploys, and lets you interact with the chain from the command-line and via Solidity scripts [Foundry Installation](https://book.getfoundry.sh/getting-started/installation)

Part of the Foundry application development toolkit
---------------------------------------------------

_Forge_ : Forge is a command-line tool that ships with Foundry. Forge tests, builds, and deploys your smart contracts.

_Cast_ : Cast is Foundry’s command-line tool for performing Ethereum RPC calls. You can make smart contract calls, send transactions, or retrieve any type of chain data — all from your command-line

_Anvil_: Anvil is a local testnet node shipped with Foundry. You can use it for testing your contracts from frontends or for interacting over RPC

Setting Up Project
------------------

Let’s start off by creating a Foundry project using forge. Open your terminal and run the following command

```
forge init contract
```

Once its Done

```
cd contract
ls
```

There you can see four folders

```
.
├── lib
├── script
├── src
└── test
```

In src folder we write our contract

Adding a dependency
-------------------

To add a dependency, run _forge install_

```
forge install transmissions11/solmate
forge install openzeppelin/openzeppelin-contracts
```

We will write contract inside the _src_ folder

Let’s create the contract
-------------------------

Here, we will create a simple Solidity contract that allows users to update a message and view the previous messages

```
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

Let’s go through the code….

```
// SPDX-License-Identifier: MIT
```

This is a comment that indicates the license under which the Solidity contract is released. In this case, it is using the MIT license, which is a permissive open-source license

```
pragma solidity ^0.8.19;
```

This is a Solidity version pragma, specifying the version of Solidity to be used for compiling the contract. In this case, it specifies version 0.8.19 or higher

```
contract Message {
```

This is the beginning of the contract definition. It defines a contract named “Message”

```
 string public current_message;
```

This declares a public state variable current_message of type string, which will store the current message.

```
string public previous_message;
```

This declares another public state variable previous_message of type string, which will store the previous message.

```
function ChangeMessage(string calldata _message) public {
        previous_message = current_message;
        current_message = _message;
    }
```

The ChangeMessage function is a public function in the Solidity contract that updates the current_message variable with a new string parameter _message. It also stores the previous message in the previous_message variable to track changes. This function allows users to update and track the message stored in the contract

**Now we can build the project with forge build**
-------------------------------------------------

```
forge build
[⠰] Compiling...
[⠒] Compiling 21 files with 0.8.19
[⠒] Solc 0.8.19 finished in 6.10s
Compiler run successful
```

You’ll notice that two new directories have popped up: _out_ and _cache_.

The out directory contains your contract artifact, such as the ABI, while the cache is used by forge to only recompile what is necessary.

TEST
----

Forge allows you to run tests using the _forge test_ command. All tests are written in Solidity.Forge automatically searches for tests in your source directory, considering any contract with a function that starts with “test” as a test. By convention, tests are usually placed in the “test/” directory and end with “.t.sol”.

Get Adarshswaminath’s stories in your inbox
-------------------------------------------

Join Medium for free to get updates from this writer.

Subscribe

Subscribe

Remember me for faster sign in

Now let’s create the test in _/test_ folder

```
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
        assertEq(message.current_message(),"Second");
        assertEq(message.previous_message(),"First");
    } 
}
```

In our contract, we explain the first two lines of Solidity, so now we skip these two lines

```
import "forge-std/Test.sol;
```

This line imports the Test.sol library from Forge, which provides testing functionalities for Solidity contracts.

```
import "../src/Message.sol";
```

This line imports the Message.sol contract from the “../src/” directory, which is the contract being tested in this test contract.

```
contract MessageTest is Test {
```

This line declares a new contract named MessageTest that inherits from the Test contract provided by Forge, allowing us to use its testing functionalities.

```
Message public message;
```

This line declares a public Message variable named message, which represents an instance of the Message.sol contract and will be used for testing.

```
function setUp() public {
        message = new Message();
    }
```

The function “setUp” is a public function that creates a new instance of the “Message” contract. It is likely used to initialize the state of the contract and set up initial values or configurations for the “Message” contract.

_setUp_ An optional function invoked before each test case is run

```
function testChange() public {
        message.ChangeMessage("First");
        message.ChangeMessage("Second");
        assertEq(message.current_message(),"Second");
        assertEq(message.previous_message(),"First");
    }
```

The function “testChange” is a public function in a Solidity contract that tests the functionality of a “Message” contract. It first calls the “ChangeMessage” function of the “Message” contract twice, passing “First” and “Second” as arguments, respectively. Then, it uses the “assertEq” function to check that the “current_message” function of the “Message” contract returns “Second” and the “previous_message” function returns “First”, indicating that the “ChangeMessage” function successfully updated the state of the “Message” contract.

The function “testChange” is a public function in a Solidity contract that tests the functionality of a “Message” contract. It first calls the “ChangeMessage” function of the “Message” contract twice, passing “First” and “Second” as arguments, respectively. Then, it uses the “assertEq” function to check that the “current_message” function of the “Message” contract returns “Second” and the “previous_message” function returns “First”, indicating that the “ChangeMessage” function successfully updated the state of the “Message” contract.

The function “testChange” is a public function in a Solidity contract that tests the functionality of a “Message” contract. It first calls the “ChangeMessage” function of the “Message” contract twice, passing “First” and “Second” as arguments, respectively. Then, it uses the “assertEq” function to check that the “current_message” function of the “Message” contract returns “Second” and the “previous_message” function returns “First”, indicating that the “ChangeMessage” function successfully updated the state of the “Message” contract.

> test Functions prefixed with _test_ are run as a test case

Then run the _forge test_ command

```
forge test
[⠔] Compiling...
[⠊] Compiling 1 files with 0.8.19
[⠢] Solc 0.8.19 finished in 2.41s
Compiler run successful
Running 1 test for test/Message.t.sol:MessageTest
[PASS] testChange() (gas: 58905)
Test result: ok. 1 passed; 0 failed; finished in 1.17ms
```

Forge can produce gas reports for your contracts. We can configure which contracts output gas reports via the gas_reports field in foundry.toml

```
gas_reports = ["MyContract", "MyContractFactory"]
```

To produce reports for all contracts:

```
gas_reports = ["*"] 
```

To generate gas reports, run

```
forge test --gas-report
[⠰] Compiling...
[⠃] Compiling 3 files with 0.8.19
[⠊] Solc 0.8.19 finished in 2.41s
Compiler run successful
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

ANVIL
-----

Anvil is a local testnet node shipped with Foundry. You can use it for testing your contracts from frontends or for interacting over RPC.Anvil is part of the Foundry suite and is installed alongside forge, cast, and chisel

```
anvil
```![captionless image](https://miro.medium.com/v2/resize:fit:1114/format:webp/1*qA474OuvnVX5u6czEnV2Qw.png)

Deploy
------

Forge can deploy smart contracts to a given network with the _forge create_ command.

Forge can deploy only one contract at a time.To deploy a contract, you must provide a RPC URL (env: ETH_RPC_URL) and the private key of the account that will deploy the contract. For this contract we are using **anvil** local testnet node.

To deploy Contract :

```
forge create --rpc-url "http://127.0.0.1:8545" --private-key " 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" src/Message.sol:Message
```

Solidity files may contain multiple contracts. :Message above specifies which contract to deploy from the src/Message.sol file

```
[⠘] Compiling...
[⠰] Compiling 1 files with 0.8.19
[⠒] Solc 0.8.19 finished in 2.56s
Compiler run successful
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Transaction hash: 0xfd6b8716c0b3498ef20228eb5317029381423960d7081d14f4386d63fd6718c6
```

Remember, this contract is deployed on a local test node (such as Anvil). You can deploy your contract on the testnet or mainnet by updating the private key to your wallet’s private key and using a real RPC URL [Best RPC Providers](https://www.alchemy.com/best/rpc-node-providers)

For more detailed information on these topics, you can refer to the [documentation](https://book.getfoundry.sh/)

> If you spot any mistakes or have any feedback, please feel free to point them out