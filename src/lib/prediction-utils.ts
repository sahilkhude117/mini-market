import { PublicKey } from "@solana/web3.js";
import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || "6ab09644822193eed05d";
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || "e920681dec7cb1d967ab69aaff433c1a94d4e4b3da53dc0d169f6736c7292708";

export const uploadToPinata = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    console.log("uploading...");
    
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );
    console.log("finished uploading", response.data.IpfsHash);

    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    return null;
  }
};

export function findJsonPathsForKey(jsonStr: string, key: string): string[] {
  const paths: string[] = [];

  function search(obj: any, path: string = "$") {
    if (typeof obj !== "object" || obj === null) return;

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        search(item, `${path}[${index}]`);
      });
    } else {
      for (const k in obj) {
        if (k === key) {
          paths.push(`${path}.${k}`);
        }
        search(obj[k], `${path}.${k}`);
      }
    }
  }

  try {
    const data = JSON.parse(jsonStr);
    search(data);
    return paths;
  } catch (e) {
    console.error("Invalid JSON:", e);
    return [];
  }
}

export const getCountDown = (targetDateStr: string) => {
  const targetDate = new Date(targetDateStr);
  const now = new Date();

  let diff = Math.max(0, targetDate.getTime() - now.getTime());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  const seconds = Math.floor(diff / 1000);

  return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
};

export const elipsKey = (content: string) => {
  return content.length > 10
    ? content.slice(0, 4) + "..." + content.slice(content.length - 4, content.length)
    : content;
};

export const isPublickey = (addr: string) => {
  try {
    const key = new PublicKey(addr);
    return PublicKey.isOnCurve(key.toBytes());
  } catch (error) {
    console.log("Invalid Address:", error);
    return false;
  }
};

export function timeAgo(ms: number): string {
  const now = Date.now();
  const diff = now - ms;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
