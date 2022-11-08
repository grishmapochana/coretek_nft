/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    TOKEN_ADDRESS: "0xb5A83773D4EA82229C5b2a96EA12142CE9147011",
    NFT_MARKET_CONTRACT_ADDRESS: "0xA1e679cbbd74530f3A5477488e75A80334B7B9b6",
    NFT_CONTRACT_ADDRESS: "0x90F99d30159a90e5115E44B27F837f45EC65e4Ff",
    LISTING_FEE: "0.045",
    CHAIN_ID: 3,
    TEST_CHAIN_ID: 97,
    PROJECT_ID: "2Gd2cSLJcKQlVRGLgfUsfZvLOql",
    PROJECT_SECRET: "c308473b750eeb731e054852b3b9e877",
  },
  images: {
    domains: ["https://coretek-nft.infura-ipfs.io/ipfs"],
  },
};

module.exports = nextConfig
