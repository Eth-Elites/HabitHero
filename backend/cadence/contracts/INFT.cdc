import NonFungibleToken from 0x631e88ae7f1d7c20

// Simple Habithero NFT Contract for Hackathon POC
access(all) contract HabitheroNFT {

    // Total supply counter
    access(all) var totalSupply: UInt64

    // Event emitted when a new NFT is minted
    access(all) event Minted(id: UInt64, owner: Address, cid: String)

    // Event emitted when an NFT grows
    access(all) event Grown(id: UInt64, cid: String, level: UInt8, updatedAt: UFix64)

    // NFT resource - simple structure for your use case
    access(all) resource NFT {
        access(all) let id: UInt64
        access(all) var cid: String          // IPFS CID of current avatar
        access(all) var level: UInt8         // Growth stage (1 = baby, 2 = child, etc.)
        access(all) var createdAt: UFix64
        access(all) var updatedAt: UFix64
        access(all) var details: String      // Additional details about the NFT

        init(id: UInt64, cid: String, details: String) {
            self.id = id
            self.cid = cid
            self.level = 1
            self.createdAt = getCurrentBlock().timestamp
            self.updatedAt = self.createdAt
            self.details = details
        }

        // Grow NFT after task completion - this is the key function for your use case
        access(all) fun grow(newCID: String, newDetails: String) {
            self.cid = newCID
            self.level = self.level + 1
            self.updatedAt = getCurrentBlock().timestamp
            self.details = newDetails
            emit Grown(id: self.id, cid: self.cid, level: self.level, updatedAt: self.updatedAt)
        }

        // Get NFT metadata for frontend
        access(all) fun getMetadata(): {String: String} {
            return {
                "id": self.id.toString(),
                "cid": self.cid,
                "level": self.level.toString(),
                "createdAt": self.createdAt.toString(),
                "updatedAt": self.updatedAt.toString(),
                "details": self.details
            }
        }
    }

    // Collection resource to store user NFTs
    access(all) resource Collection {
        access(all) var ownedNFTs: @{UInt64: NFT}

        init() {
            self.ownedNFTs <- {}
        }

        // Deposit NFT into collection
        access(all) fun deposit(token: @NFT) {
            let nft <- token
            self.ownedNFTs[nft.id] <-! nft
        }

        // Withdraw NFT from collection
        access(all) fun withdraw(withdrawID: UInt64): @NFT {
            let nft <- self.ownedNFTs.remove(key: withdrawID)
                ?? panic("NFT does not exist in collection")
            return <- nft
        }

        // Borrow NFT reference for reading
        access(all) fun borrowNFT(id: UInt64): &NFT {
            let nft = &self.ownedNFTs[id] as &NFT?
            return nft ?? panic("NFT does not exist")
        }

        // Get all NFT IDs owned by this collection
        access(all) fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // Get number of NFTs in collection
        access(all) fun getLength(): Int {
            return self.ownedNFTs.length
        }
    }

    // Admin resource to mint NFTs
    access(all) resource Admin {
        // Mint new NFT (baby stage)
        access(all) fun mintNFT(recipient: &Collection, cid: String, details: String) {
            HabitheroNFT.totalSupply = HabitheroNFT.totalSupply + 1
            let newNFT <- create NFT(id: HabitheroNFT.totalSupply, cid: cid, details: details)
            recipient.deposit(token: <- newNFT)
            emit Minted(id: HabitheroNFT.totalSupply, owner: recipient.owner?.address ?? 0x0, cid: cid)
        }
    }

    access(all) var admin: @Admin

    // Contract initializer
    init() {
        self.totalSupply = 0
        self.admin <- create Admin()
    }

    // Create an empty collection for users
    access(all) fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    // Get total supply
    access(all) fun getTotalSupply(): UInt64 {
        return self.totalSupply
    }
}