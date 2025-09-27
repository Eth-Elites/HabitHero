package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

// IPFSConfig holds the IPFS configuration
type IPFSConfig struct {
	APIURL        string
	Gateway       string
	PublicGateway string
}

// IPFSResponse represents the response from IPFS API
type IPFSResponse struct {
	Name string `json:"Name"`
	Hash string `json:"Hash"`
	Size string `json:"Size"`
}

// UploadResponse represents the response for file upload
type UploadResponse struct {
	Hash       string `json:"hash"`
	Size       string `json:"size"`
	LocalURL   string `json:"local_url"`
	PublicURL  string `json:"public_url"`
	GatewayURL string `json:"gateway_url"`
}

// Server struct holds the server configuration
type Server struct {
	config *IPFSConfig
}

// NewServer creates a new server instance
func NewServer() *Server {
	return &Server{
		config: &IPFSConfig{
			APIURL:        "http://127.0.0.1:5001/api/v0/add",
			Gateway:       "http://127.0.0.1:8081/ipfs/",
			PublicGateway: "https://ipfs.io/ipfs/",
		},
	}
}

// uploadFileToIPFS uploads a file to IPFS and returns the hash
func (s *Server) uploadFileToIPFS(fileHeader *multipart.FileHeader) (*IPFSResponse, error) {
	// Open the uploaded file
	file, err := fileHeader.Open()
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %v", err)
	}
	defer file.Close()

	// Create a buffer to store the file content
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)

	// Create a form file field
	fileWriter, err := writer.CreateFormFile("file", fileHeader.Filename)
	if err != nil {
		return nil, fmt.Errorf("failed to create form file: %v", err)
	}

	// Copy file content to the form
	_, err = io.Copy(fileWriter, file)
	if err != nil {
		return nil, fmt.Errorf("failed to copy file content: %v", err)
	}

	// Close the writer
	writer.Close()

	// Create HTTP request to IPFS API
	req, err := http.NewRequest("POST", s.config.APIURL, &buf)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	// Set content type
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// Make the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request to IPFS: %v", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %v", err)
	}

	// Check if request was successful
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("IPFS API returned status %d: %s", resp.StatusCode, string(body))
	}

	// Parse JSON response
	var ipfsResp IPFSResponse
	err = json.Unmarshal(body, &ipfsResp)
	if err != nil {
		return nil, fmt.Errorf("failed to parse IPFS response: %v", err)
	}

	return &ipfsResp, nil
}

// uploadHandler handles file upload to IPFS
func (s *Server) uploadHandler(c *gin.Context) {
	// Get the uploaded file
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to get uploaded file: " + err.Error(),
		})
		return
	}

	// Validate file size (optional: limit to 100MB)
	const maxFileSize = 100 << 20 // 100MB
	if file.Size > maxFileSize {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "File size exceeds maximum limit of 100MB",
		})
		return
	}

	// Upload file to IPFS
	ipfsResp, err := s.uploadFileToIPFS(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to upload file to IPFS: " + err.Error(),
		})
		return
	}

	// Create response
	response := UploadResponse{
		Hash:       ipfsResp.Hash,
		Size:       ipfsResp.Size,
		LocalURL:   s.config.Gateway + ipfsResp.Hash,
		PublicURL:  s.config.PublicGateway + ipfsResp.Hash,
		GatewayURL: s.config.Gateway + ipfsResp.Hash,
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    response,
		"message": "File uploaded successfully to IPFS",
	})
}

// retrieveHandler handles file retrieval from IPFS
func (s *Server) retrieveHandler(c *gin.Context) {
	hash := c.Param("hash")
	if hash == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Hash parameter is required",
		})
		return
	}

	// Construct URLs for different gateways
	localURL := s.config.Gateway + hash
	publicURL := s.config.PublicGateway + hash

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"hash":        hash,
			"local_url":   localURL,
			"public_url":  publicURL,
			"gateway_url": localURL,
		},
		"message": "File URLs generated successfully",
	})
}

// downloadHandler handles file download from IPFS
func (s *Server) downloadHandler(c *gin.Context) {
	hash := c.Param("hash")
	if hash == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Hash parameter is required",
		})
		return
	}

	// Construct the IPFS gateway URL
	gatewayURL := s.config.Gateway + hash

	// Make request to IPFS gateway
	resp, err := http.Get(gatewayURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve file from IPFS: " + err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "File not found in IPFS",
		})
		return
	}

	// Get content type
	contentType := resp.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	// Set headers for file download
	c.Header("Content-Type", contentType)
	c.Header("Content-Disposition", "attachment; filename="+filepath.Base(hash))

	// Stream the file content
	_, err = io.Copy(c.Writer, resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to stream file content: " + err.Error(),
		})
		return
	}
}

// healthHandler provides health check endpoint
func (s *Server) healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"message": "IPFS server is running",
		"config": gin.H{
			"api_url":        s.config.APIURL,
			"gateway":        s.config.Gateway,
			"public_gateway": s.config.PublicGateway,
		},
	})
}

// setupRoutes configures all the routes
func (s *Server) setupRoutes() *gin.Engine {
	// Set Gin to release mode in production
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// Add CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check endpoint
	r.GET("/health", s.healthHandler)

	// File upload endpoint
	r.POST("/upload", s.uploadHandler)

	// File retrieval endpoints
	r.GET("/retrieve/:hash", s.retrieveHandler)
	r.GET("/download/:hash", s.downloadHandler)

	// Root endpoint with API information
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "IPFS File Server",
			"version": "1.0.0",
			"endpoints": gin.H{
				"upload":   "POST /upload",
				"retrieve": "GET /retrieve/:hash",
				"download": "GET /download/:hash",
				"health":   "GET /health",
			},
		})
	})

	return r
}

func main() {
	// Create server instance
	server := NewServer()

	// Setup routes
	router := server.setupRoutes()

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	// Start server
	fmt.Printf("Starting IPFS server on port %s\n", port)
	fmt.Printf("IPFS API URL: %s\n", server.config.APIURL)
	fmt.Printf("IPFS Gateway: %s\n", server.config.Gateway)
	fmt.Printf("Public Gateway: %s\n", server.config.PublicGateway)

	if err := router.Run(":" + port); err != nil {
		fmt.Printf("Failed to start server: %v\n", err)
		os.Exit(1)
	}
}
