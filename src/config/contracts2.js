// ================= ADDRESSES =================
// Isi dengan address hasil deploy nanti

export const BNB_STAKING_ADDRESS = "0xb85d18d2A93Cf692511B1896599212BeBFDCF890"; // Ganti dengan address BNB Staking
export const USDT_STAKING_ADDRESS = "0x9Bcb8414690647A6b477b085Ac7D1f624c449FeF"; // Ganti dengan address USDT Staking

export const LIQUIFY_TOKEN_ADDRESS = "0xdc228DD2B3AF4Dde862155a1cB39498A7Dfa41C6";
export const USDT_TOKEN_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";

// =====================================================
// ================= BNB STAKING ABI =================
// Stake BNB earn LIQ (Flexible, 8% APR)
// =====================================================

export const BNB_STAKING_ABI = [
  {
    name: "deposit",
    type: "function",
    stateMutability: "payable",
    inputs: [],
    outputs: []
  },
  {
    name: "userInfo",
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
    name: "emergencyWithdraw",
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
    name: "currentAPR",
    type: "function",
    stateMutability: "pure",
    inputs: [],
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
    name: "totalStakers",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "totalRewardDistributed",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "treasuryBalance",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "rewardToken",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }]
  }
];

// =====================================================
// ================= USDT STAKING ABI =================
// Stake USDT earn LIQ (Flexible, 8% APR)
// =====================================================

export const USDT_STAKING_ABI = [
  {
    name: "deposit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_amount", type: "uint256" }],
    outputs: []
  },
  {
    name: "userInfo",
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
    name: "emergencyWithdraw",
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
    name: "currentAPR",
    type: "function",
    stateMutability: "pure",
    inputs: [],
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
    name: "totalStakers",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "totalRewardDistributed",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "treasuryBalance",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "stakeToken",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }]
  },
  {
    name: "rewardToken",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }]
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
    outputs: [{ name: "", type: "bool" }]
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
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    name: "transferFrom",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  }
];
