import {
  isConnected,
  requestAccess,
  isAllowed,
  setAllowed
} from "@stellar/freighter-api";

const BACKEND_URL = 'https://ayuda-backend.onrender.com';

export interface ScanResponse {
  nfc_hash: string | null;
  is_fresh: boolean;
}

export interface ApiResponse {
  status: string;
  message: string;
  result?: string;
}

export const AyudaBridge = {
  connectWallet: async (): Promise<string | null> => {
    const connection = await isConnected();

    if (connection && connection.isConnected) {
      const access = await requestAccess();

      if (access.error) {
        console.error("Freighter Access Error:", access.error);
        return null;
      }

      return access.address;
    }

    throw new Error("Freighter Extension Not Found");
  },

  getLatestScan: async (): Promise<ScanResponse> => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/latest-scan`);
      if (!res.ok) throw new Error("Backend Unreachable");
      return await res.json();
    } catch (e) {
      return { nfc_hash: null, is_fresh: false };
    }
  },

  register: async (name: string, addr: string, amount: number): Promise<ApiResponse> => {
    const res = await fetch(`${BACKEND_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizen_name: name,
        citizen_addr: addr,
        amount: amount
      }),
    });

    if (!res.ok) throw new Error("Registration Failed");
    return await res.json();
  },

  getProtocolStatus: async () => {
    const res = await fetch(`${BACKEND_URL}/api/status`);
    return await res.json();
  }
};
