import { isConnected, requestAccess } from "@stellar/freighter-api";

const BACKEND_URL = 'https://ayuda-backend.onrender.com';

export interface ScanResponse {
  nfc_hash: string | null;
  is_fresh: boolean;
}

export const AyudaBridge = {
  connectWallet: async (): Promise<string | null> => {
    const connection = await isConnected();
    if (connection && connection.isConnected) {
      const access = await requestAccess();
      return access.address || null;
    }
    throw new Error("Freighter Not Found");
  },

  getLatestScan: async (): Promise<ScanResponse> => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/latest-scan`);
      return await res.json();
    } catch {
      return { nfc_hash: null, is_fresh: false };
    }
  },

  register: async (name: string, addr: string, amount: number) => {
    const res = await fetch(`${BACKEND_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizen_name: name,
        citizen_addr: addr,
        amount: amount
      }),
    });
    return await res.json();
  }
};
