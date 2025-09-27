package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
)

// Simple server for HabitHero NFT interactions
// This is a simplified version for hackathon - you can integrate Flow SDK later

// NFT data structure
type NFTData struct {
	ID        uint64    `json:"id"`
	CID       string    `json:"cid"`
	Level     uint8     `json:"level"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Details   string    `json:"details"`
}

// User registration data
type UserData struct {
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

// Simple in-memory storage for hackathon demo
var nfts = make(map[uint64]NFTData)
var users = make(map[string]UserData)
var nextNFTID uint64 = 1

func main() {
	// Simple HTTP endpoints
	http.HandleFunc("/mint-nft", mintNFT)
	http.HandleFunc("/grow-nft", growNFT)
	http.HandleFunc("/get-nft", getNFT)
	http.HandleFunc("/register-user", registerUser)
	http.HandleFunc("/get-user", getUser)
	http.HandleFunc("/", homePage)

	fmt.Println("🚀 HabitHero Backend running on :8080")
	fmt.Println("Endpoints:")
	fmt.Println("  POST /mint-nft - Mint new baby NFT")
	fmt.Println("  POST /grow-nft - Grow existing NFT")
	fmt.Println("  GET /get-nft?id=123 - Get NFT data")
	fmt.Println("  POST /register-user - Register new user")
	fmt.Println("  GET /get-user?addr=0x123 - Get user data")

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func homePage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{
		"message": "HabitHero Backend API",
		"version": "1.0.0",
		"endpoints": {
			"mint_nft": "POST /mint-nft",
			"grow_nft": "POST /grow-nft", 
			"get_nft": "GET /get-nft?id=123",
			"register_user": "POST /register-user",
			"get_user": "GET /get-user?addr=0x123"
		}
	}`)
}

// Mint new baby NFT
func mintNFT(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse form data
	cid := r.FormValue("cid")
	details := r.FormValue("details")
	recipient := r.FormValue("recipient")

	if cid == "" || details == "" || recipient == "" {
		http.Error(w, "Missing required fields: cid, details, recipient", http.StatusBadRequest)
		return
	}

	// Create new NFT
	nft := NFTData{
		ID:        nextNFTID,
		CID:       cid,
		Level:     1, // Baby stage
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Details:   details,
	}

	nfts[nextNFTID] = nft
	nextNFTID++

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":        true,
		"nft_id":         nft.ID,
		"transaction_id": fmt.Sprintf("demo_tx_%d", time.Now().Unix()),
		"nft":            nft,
	})
}

// Grow existing NFT
func growNFT(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse form data
	nftIDStr := r.FormValue("nft_id")
	newCID := r.FormValue("new_cid")
	newDetails := r.FormValue("new_details")
	owner := r.FormValue("owner")

	if nftIDStr == "" || newCID == "" || newDetails == "" || owner == "" {
		http.Error(w, "Missing required fields: nft_id, new_cid, new_details, owner", http.StatusBadRequest)
		return
	}

	nftID, err := strconv.ParseUint(nftIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid NFT ID", http.StatusBadRequest)
		return
	}

	// Check if NFT exists
	nft, exists := nfts[nftID]
	if !exists {
		http.Error(w, "NFT not found", http.StatusNotFound)
		return
	}

	// Grow the NFT
	nft.CID = newCID
	nft.Level++
	nft.UpdatedAt = time.Now()
	nft.Details = newDetails

	nfts[nftID] = nft

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":        true,
		"transaction_id": fmt.Sprintf("demo_tx_%d", time.Now().Unix()),
		"nft":            nft,
	})
}

// Get NFT data
func getNFT(w http.ResponseWriter, r *http.Request) {
	nftIDStr := r.URL.Query().Get("id")

	if nftIDStr == "" {
		http.Error(w, "Missing required parameter: id", http.StatusBadRequest)
		return
	}

	nftID, err := strconv.ParseUint(nftIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid NFT ID", http.StatusBadRequest)
		return
	}

	// Check if NFT exists
	nft, exists := nfts[nftID]
	if !exists {
		http.Error(w, "NFT not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"nft":     nft,
	})
}

// Register user
func registerUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	name := r.FormValue("name")
	email := r.FormValue("email")
	address := r.FormValue("address")

	if name == "" || email == "" || address == "" {
		http.Error(w, "Missing required fields: name, email, address", http.StatusBadRequest)
		return
	}

	// Check if user already exists
	if _, exists := users[address]; exists {
		http.Error(w, "User already registered", http.StatusConflict)
		return
	}

	// Create new user
	user := UserData{
		Name:      name,
		Email:     email,
		CreatedAt: time.Now(),
	}

	users[address] = user

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":        true,
		"transaction_id": fmt.Sprintf("demo_tx_%d", time.Now().Unix()),
		"user":           user,
	})
}

// Get user data
func getUser(w http.ResponseWriter, r *http.Request) {
	address := r.URL.Query().Get("addr")

	if address == "" {
		http.Error(w, "Missing required parameter: addr", http.StatusBadRequest)
		return
	}

	// Check if user exists
	user, exists := users[address]
	if !exists {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"user":    user,
	})
}
