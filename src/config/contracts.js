// ================= ADDRESSES =================

export const NORMAL_STAKING_ADDRESS = "0x827252216202E38Dd1bAc7A141f2754CA4D04061";
export const GENESIS_STAKING_ADDRESS = "0x7Fb3F9e53FbB5409FdfB51F944205f69C6D5a173";

export const LIQUIFY_TOKEN_ADDRESS = "0x3930158755F1AEAc5b56C187d173F38Bd1F7f5F4";
export const USDT_TOKEN_ADDRESS = "0xD66DF1D6dc178Cc755977D1A51733cE18Fa175eE";


// =====================================================
// ================= NORMAL STAKING ABI =================
// LiquifyStaking (earn LIQUIFY)
// =====================================================

export const NORMAL_STAKING_ABI = [
  {
    name: "deposit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_amount", type: "uint256" }],
    outputs: []
  },
  {
    name: "userInfo",  // <-- TAMBAHKAN ini (otomatis dari public mapping)
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [
      { name: "amount", type: "uint256" },
      { name: "lastUpdate", type: "uint256" },
      { name: "unclaimed", type: "uint256" }
    ]
  },
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_amount", type: "uint256" }],
    outputs: []
  },
  {
    name: "claim",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: []
  },
  {
    name: "pendingReward",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    name: "totalStaked",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "totalStakers",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "currentAPR",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  }
];


// =====================================================
// ================= GENESIS STAKING ABI =================
// USDTStaking (earn USDT)
// =====================================================

// =====================================================
// ================= GENESIS STAKING ABI =================
// USDTStaking (earn USDT)
// =====================================================

export const GENESIS_STAKING_ABI = [
  {
    name: "deposit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_amount", type: "uint256" }],
    outputs: []
  },
  {
    name: "userInfo",  // <-- TAMBAHKAN ini (otomatis dari public mapping)
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [
      { name: "amount", type: "uint256" },
      { name: "rewardStored", type: "uint256" },
      { name: "lastUpdate", type: "uint256" }
    ]
  },
  {
    name: "withdraw",  // <-- TAMBAHKAN withdraw
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_amount", type: "uint256" }],
    outputs: []
  },
  {
    name: "claim",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: []
  },
  {
    name: "pendingReward",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "totalStaked",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "totalStakers",  // <-- TAMBAHKAN totalStakers
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "APR",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "remainingRewardCap",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "remainingPoolCap",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "startTime",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "endTime",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "TOKEN_PRICE",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  }
];
// =====================================================
// ================= ERC20 ABI =================
// =====================================================

export const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    outputs: []
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" }
    ],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }]
  }
];
