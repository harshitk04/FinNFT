# 💳 FinNFT - AI-Powered Financial Analytics & NFT Generator

![FinNFT Banner](https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=FinNFT+-+Financial+NFTs+with+AI)

Transform your transaction history into actionable insights and unique NFTs. FinNFT combines **RAG-powered financial analysis** with **AI-generated NFT art**, all secured on the blockchain.

## ✨ Key Features

- **Transaction Intelligence**  
  Upload bank statements → Get auto-categorized spending insights + chatbot for natural language queries ("How much did I spend on food last month?")

- **AI NFT Generator**  
  Create personalized artwork from prompts → Mint as ERC-721 tokens on Polygon → Buy/sell via MetaMask

- **Smart Dashboard**  
  Interactive Next.js and GraphQL visualizations of spending patterns with custom tagging

## 🛠️ Tech Stack

### Blockchain Layer
- **Smart Contracts**: Solidity (ERC-721) + Hardhat
- Used Ethereum
- **Wallet**: MetaMask SDK

### AI/ML Layer
- **Financial Analysis**: LangChain (RAG) + OpenAI embeddings
- **Image Generation**: Stable Diffusion XL
- **Vector DB**: ChromaDB

### Application Layer
- **Frontend**: Next.js 14 (App Router), Tailwind, Shadcn/ui
- **Backend**: FastAPI, Firebase Auth
- **Database**: PostgreSQL (Analytics), IPFS (NFT storage)
