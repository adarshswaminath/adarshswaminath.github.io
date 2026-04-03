---
layout: "../../layouts/BlogLayout.astro"
title: "Solidity Gas Optimization Tips"
date: "2023-03-30"
description: "A couple of tips to reduce gas consumption in your smart contracts, from pre-incrementing to caching array length."
category: "Web3"
author: "Adarsh"
---

This article is going to give you a couple of tips to reduce gas consumption in your smart contracts.

![Solidity Gas Optimization](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ErvwwJ0lHnfZiryB7EpNnA.jpeg)

Solidity is a programming language for creating smart contracts on the Ethereum blockchain, with features for handling cryptocurrency transactions and executing code under specific conditions. It’s commonly used in the creation of decentralised applications (dApps) like decentralised exchanges, non-fungible token (NFT) marketplaces, and decentralised finance (DeFi) platforms.

Gas is the fuel that drives the execution of smart contracts on the Ethereum blockchain. A certain amount of gas is used each time a smart contract is executed, and the user must pay for that gas in Ether. This ensures that the network is used efficiently and that malicious code is not able to take over the network. Optimizing gas usage is important for smart contract developers because it reduces transaction costs and increases network efficiency by reducing the amount of gas required to execute a contract.

## Gas Optimizing Techniques

### 1. Pre-Increment

![Pre-Increment](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4_uVhP7Q872_uYgIT8II1A.png)

Pre-increment is more gas-efficient than Increment because it uses the pre-increment operator, which saves on gas compared to the post-increment operator used in Increment. When optimizing for gas usage, it is recommended to use the pre-increment operator whenever possible.

### 2. Storing data inside calldata

![Calldata](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*WWAmB9gno6K1JGrpZ8-75g.png)

One key difference is that `calldata` arguments are immutable, meaning they cannot be modified within the function. The `calldata` storage type is more gas-efficient than `memory`, making it useful for optimizing the gas cost of a contract.

### 3. Uint8 (without Storage packing)

![Uint8 vs Uint256](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vmTEE4JfvoMXtpbddvxguA.png)

The gas cost for the `uint8` function is slightly higher than the `uint256` function, making `uint256` more gas-efficient for incrementing variables.

### 4. Cache the array length

![Cache Array Length](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*swnGK2AFT1Xd_-9-Fls_vg.png)

By assigning the length to a separate variable outside of the loop, the gas cost of the loop can be significantly reduced, as the length only needs to be calculated once.

### 5. `<` operator instead of `<=`

![LT vs LTE](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NC6akOojcrFIGwDcXrNOmA.png)

In the given example, the `lessThan` function uses only one opcode, `LT`, to check if the given number is less than 4, while the `lessThanEq` function uses two opcodes, `GT` and `ISZERO`, to check if the given number is greater than 3. Therefore, `lessThan` is more gas-efficient than `lessThanEq`.

### 6. Exponentiation operator

![Exponentiation](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*zmV5sHEGLolvy9Yst81Qjg.png)

Exponentiation operator requires less computational steps to raise a number to a power compared to multiplication. As a result, it uses less gas and reduces the transaction cost. This optimization increases the efficiency of the contract execution and can result in cost savings for the users.

> *This is my first attempt at writing about gas optimization in Solidity contracts, so please forgive any mistakes.*
