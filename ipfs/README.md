# IPFS File Server

A Gin-based HTTP server that allows you to upload files to IPFS and retrieve them using various gateways.

## Features

- Upload files to IPFS via HTTP API
- Retrieve file URLs from different IPFS gateways
- Download files directly from IPFS
- Health check endpoint
- CORS support
- File size validation (100MB limit)

## Prerequisites

1. **IPFS Node**: You need a running IPFS node with API enabled
2. **Go 1.21+**: Make sure you have Go installed

## IPFS Setup

Make sure your IPFS node is running with the API enabled:

```bash
# Start IPFS daemon
ipfs daemon

# The API should be available at http://127.0.0.1:5001
# The gateway should be available at http://127.0.0.1:8080 (default) or http://127.0.0.1:8081
```

## Installation

1. Clone or download this repository
2. Install dependencies:

```bash
go mod tidy
```

## Running the Server

```bash
go run main.go
```

The server will start on port 8080 by default. You can change the port by setting the `PORT` environment variable:

```bash
PORT=3000 go run main.go
```

## API Endpoints

### 1. Upload File to IPFS
**POST** `/upload`

Upload a file to IPFS and get back the hash and URLs.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (form field named "file")

**Response:**
```json
{
  "success": true,
  "data": {
    "hash": "QmYourFileHash...",
    "size": "12345",
    "local_url": "http://127.0.0.1:8081/ipfs/QmYourFileHash...",
    "public_url": "https://ipfs.io/ipfs/QmYourFileHash...",
    "gateway_url": "http://127.0.0.1:8081/ipfs/QmYourFileHash..."
  },
  "message": "File uploaded successfully to IPFS"
}
```

### 2. Retrieve File URLs
**GET** `/retrieve/:hash`

Get URLs for accessing a file from different IPFS gateways.

**Response:**
```json
{
  "success": true,
  "data": {
    "hash": "QmYourFileHash...",
    "local_url": "http://127.0.0.1:8081/ipfs/QmYourFileHash...",
    "public_url": "https://ipfs.io/ipfs/QmYourFileHash...",
    "gateway_url": "http://127.0.0.1:8081/ipfs/QmYourFileHash..."
  },
  "message": "File URLs generated successfully"
}
```

### 3. Download File
**GET** `/download/:hash`

Download a file directly from IPFS.

**Response:** File content with appropriate headers.

### 4. Health Check
**GET** `/health`

Check server status and IPFS configuration.

**Response:**
```json
{
  "status": "healthy",
  "message": "IPFS server is running",
  "config": {
    "api_url": "http://127.0.0.1:5001/api/v0/add",
    "gateway": "http://127.0.0.1:8081/ipfs/",
    "public_gateway": "https://ipfs.io/ipfs/"
  }
}
```

### 5. API Information
**GET** `/`

Get information about available endpoints.

## Usage Examples

### Upload a file using curl:

```bash
curl -X POST -F "file=@/path/to/your/file.txt" http://localhost:8080/upload
```

### Retrieve file URLs:

```bash
curl http://localhost:8080/retrieve/QmYourFileHash...
```

### Download a file:

```bash
curl -O http://localhost:8080/download/QmYourFileHash...
```

### Check server health:

```bash
curl http://localhost:8080/health
```

## Configuration

The server uses the following IPFS configuration:

- **IPFS API URL**: `http://127.0.0.1:5001/api/v0/add`
- **Local Gateway**: `http://127.0.0.1:8081/ipfs/`
- **Public Gateway**: `https://ipfs.io/ipfs/`

You can modify these in the `main.go` file if needed.

## Error Handling

The server includes comprehensive error handling for:

- File upload failures
- IPFS API communication errors
- File size validation
- Missing parameters
- Network timeouts

## CORS Support

The server includes CORS headers to allow cross-origin requests from web applications.

## File Size Limits

- Maximum file size: 100MB
- This can be modified in the `uploadHandler` function

## Troubleshooting

1. **IPFS API not accessible**: Make sure your IPFS daemon is running and the API is enabled
2. **Gateway not accessible**: Check if your IPFS gateway is running on the configured port
3. **File upload fails**: Verify the file size is under the limit and the IPFS node has enough storage

## Development

To build the application:

```bash
go build -o ipfs-server main.go
```

To run the built binary:

```bash
./ipfs-server
```


