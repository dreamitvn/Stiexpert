# IP Marketplace Module — Architecture & Integration

## Overview
Sàn giao dịch Sở hữu Trí tuệ (IP Marketplace) tích hợp vào STI-Expert, cho phép chuyên gia
token hóa công trình khoa học, bằng sáng chế (Nhóm III Hộ chiếu Tri thức Số) thành IP-NFT
và giao dịch trên nền tảng.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 15)                    │
│  /marketplace          — Dashboard sàn giao dịch            │
│  /dashboard/my-assets  — Quản lý IP Assets cá nhân          │
│  /dashboard/create-listing — Tạo niêm yết mới              │
│  /dashboard/transactions   — Theo dõi giao dịch/escrow     │
├─────────────────────────────────────────────────────────────┤
│                   API Layer (Django REST)                     │
│  /api/v1/marketplace/ip-assets/     — CRUD IP Assets        │
│  /api/v1/marketplace/ip-assets/mint/     — Mint IP-NFT      │
│  /api/v1/marketplace/ip-assets/my_assets/ — User's assets   │
│  /api/v1/marketplace/ip-assets/stats/    — Market stats     │
│  /api/v1/marketplace/listings/           — CRUD Listings    │
│  /api/v1/marketplace/listings/create_listing/ — New listing │
│  /api/v1/marketplace/listings/{id}/place_bid/ — Place bid   │
│  /api/v1/marketplace/transactions/       — View transactions│
│  /api/v1/marketplace/transactions/my_transactions/          │
├─────────────────────────────────────────────────────────────┤
│                   Data Models (PostgreSQL)                    │
│  marketplace_ip_asset    — Core IP entity (ERC-721/1155)    │
│  marketplace_listing     — Marketplace entry + pricing      │
│  marketplace_transaction — Escrow + settlement              │
│  marketplace_bid         — Auction/negotiation bids         │
└─────────────────────────────────────────────────────────────┘
```

## IP Tokenization (ERC-721 / ERC-1155)

- **Source mapping**: Paper → IP Asset, Patent → IP Asset, ResearchResult → IP Asset
- **Token metadata**: Follows OpenSea/ERC-721 metadata standard
  - `name`, `description`, `image`, `external_url`, `attributes[]`
- **Fractionalization**: ERC-1155 with `total_fractions` and `fraction_price`
- **Royalties**: Configurable 0-50%, auto-calculated on transactions
- **References**: Molecule Protocol (IP-NFT), Mediolano Protocol (Starknet IP)

## Smart Contract Integration (Planned)

```solidity
// STIExpertIPNFT.sol — ERC-721 with royalties
interface ISTIExpertIPNFT {
    function mint(address to, string memory tokenURI) external returns (uint256);
    function setRoyalty(uint256 tokenId, uint96 feeNumerator) external;
}

// STIExpertMarketplace.sol — Escrow + licensing
interface ISTIExpertMarketplace {
    function createListing(uint256 tokenId, uint256 price, LicenseType lt) external;
    function purchase(uint256 listingId) payable external;
    function releaseFunds(uint256 txId) external; // escrow release
}

// STIExpertFractionalization.sol — ERC-1155
interface ISTIExpertFraction {
    function fractionalize(uint256 nftId, uint256 fractions) external;
    function buyFraction(uint256 fractionId, uint256 amount) payable external;
}
```

## Security & Authentication

### VKAC DLT Integration
- Only experts with **Tích xanh** (professional_verified) or **Tích vàng** (identity_verified)
  can mint IP-NFTs and create listings
- Enforced via `IsVerifiedExpert` permission class
- VKAC credential ID stored on each IP Asset

### Zero-Knowledge Proofs
- `is_confidential` flag hides IP details from public view
- `zkp_proof_hash` = SHA-256 of `{STI-ID}|{type}|{source_id}|{title}`
- Allows verification of IP ownership without revealing content
- Full ZKP circuit planned for Phase 2 (zk-SNARK on VKAC DLT)

## Licensing Model

| Type | Description |
|------|-------------|
| `exclusive` | Buyer gets sole license |
| `non_exclusive` | Multiple licensees allowed |
| `transfer` | Full ownership transfer |
| `research_only` | Academic/research use only |
| `commercial` | Commercial exploitation rights |

## Transaction Flow

```
Expert mints IP-NFT from Passport
  → Creates Listing (price, license terms)
    → Buyer places Bid or direct purchase
      → Transaction created (status: pending)
        → Escrow funded (status: escrow_funded)
          → IP delivered (status: delivered)
            → Buyer confirms (status: completed)
              → Funds released: seller + royalty + platform fee
```

## Platform Economics
- **Platform fee**: 2.5% per transaction
- **Royalty**: Creator-defined (0-50%), auto-distributed on resale
- **Escrow**: Full purchase amount held until delivery confirmed

## Navigation

### Public (site-header.tsx)
- Trang chủ → Chuyên gia → **Sàn giao dịch IP** → Tin tức → Về chúng tôi → Liên hệ

### Dashboard Sidebar
- 💎 My IP Assets
- 🏷️ Tạo niêm yết  
- 📋 Giao dịch IP

## Files

### Backend
- `apps/marketplace/models.py` — IPAsset, Listing, Transaction, Bid
- `apps/marketplace/serializers.py` — DRF serializers + mint/create validators
- `apps/marketplace/views.py` — ViewSets with IsVerifiedExpert permission
- `apps/marketplace/urls.py` — Router registration
- `apps/marketplace/apps.py` — App config

### Frontend
- `app/(marketplace)/marketplace/page.tsx` — Public marketplace dashboard
- `app/(dashboard)/dashboard/my-assets/page.tsx` — Expert's IP assets
- `app/(dashboard)/dashboard/create-listing/page.tsx` — Create listing form
- `app/(dashboard)/dashboard/transactions/page.tsx` — Transaction tracker

## Roadmap
- [ ] Solidity smart contracts deployment (testnet → mainnet)
- [ ] ZKP circuit implementation (zk-SNARK)
- [ ] VKAC DLT on-chain credential verification
- [ ] Listing detail page with full bid history
- [ ] AI-powered IP valuation (pgvector similarity)
- [ ] Celery tasks for async minting notifications
