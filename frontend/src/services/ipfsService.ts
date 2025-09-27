export interface IPFSUploadResponse {
  success: boolean;
  data: {
    hash: string;
    size: string;
    local_url: string;
    public_url: string;
    gateway_url: string;
  };
  message: string;
}

export interface IPFSError {
  error: string;
}

class IPFSService {
  private baseURL = "http://localhost:3000";

  async uploadFile(file: File): Promise<IPFSUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${this.baseURL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData: IPFSError = await response.json();
        throw new Error(errorData.error || "Failed to upload file to IPFS");
      }

      const result: IPFSUploadResponse = await response.json();
      return result;
    } catch (error) {
      console.error("IPFS upload error:", error);
      throw error;
    }
  }

  async uploadImageFromPath(imagePath: string): Promise<IPFSUploadResponse> {
    try {
      // Fetch the image file
      const response = await fetch(imagePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch image from ${imagePath}`);
      }

      const blob = await response.blob();
      const file = new File([blob], "image.svg", { type: blob.type });

      return this.uploadFile(file);
    } catch (error) {
      console.error("Error uploading image from path:", error);
      throw error;
    }
  }

  getFileURL(hash: string, usePublicGateway = false): string {
    const gateway = usePublicGateway
      ? "https://ipfs.io/ipfs/"
      : "http://127.0.0.1:8081/ipfs/";
    return `${gateway}${hash}`;
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const ipfsService = new IPFSService();
