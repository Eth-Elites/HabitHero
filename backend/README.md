# HabitHero Backend

Simple Go backend using Flow Go SDK for HabitHero NFT interactions.

## Setup

1. Install Go dependencies:
```bash
go mod tidy
```

2. Run the server:
```bash
go run main.go
```

## API Endpoints

### Mint NFT (Baby Stage)
```
POST /mint-nft
Content-Type: application/x-www-form-urlencoded

cid=QmYourIPFSCID&details=Baby avatar details&recipient=0x1234567890abcdef
```

### Grow NFT (After Task Completion)
```
POST /grow-nft
Content-Type: application/x-www-form-urlencoded

nft_id=1&new_cid=QmNewIPFSCID&new_details=Grown avatar details&owner=0x1234567890abcdef
```

### Get NFT Data
```
GET /get-nft?id=1&owner=0x1234567890abcdef
```

### Register User
```
POST /register-user
Content-Type: application/x-www-form-urlencoded

name=John Doe&email=john@example.com&address=0x1234567890abcdef
```

### Get User Data
```
GET /get-user?addr=0x1234567890abcdef
```

## How It Works

1. **Mint NFT**: Creates a new baby NFT with initial metadata
2. **Grow NFT**: Updates the NFT's CID and level when tasks are completed
3. **IPFS Integration**: Store avatar images in IPFS and use CIDs for metadata
4. **Flow Blockchain**: All NFT data is stored on Flow blockchain

## Frontend Integration

Your React frontend can call these endpoints:

```javascript
// Mint new baby NFT
const mintNFT = async (cid, details, recipient) => {
  const formData = new FormData();
  formData.append('cid', cid);
  formData.append('details', details);
  formData.append('recipient', recipient);
  
  const response = await fetch('http://localhost:8080/mint-nft', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};

// Grow NFT after task completion
const growNFT = async (nftId, newCID, newDetails, owner) => {
  const formData = new FormData();
  formData.append('nft_id', nftId);
  formData.append('new_cid', newCID);
  formData.append('new_details', newDetails);
  formData.append('owner', owner);
  
  const response = await fetch('http://localhost:8080/grow-nft', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

## Flow Network

Currently configured for Flow testnet. Change the client URL in `main.go` to switch networks:
- Testnet: `https://access.devnet.nodes.onflow.org:9000`
- Mainnet: `https://access.mainnet.nodes.onflow.org:9000`
- Emulator: `http://127.0.0.1:3569`
