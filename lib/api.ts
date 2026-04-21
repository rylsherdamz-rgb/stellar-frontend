import { isConnected, requestAccess, signTransaction } from "@stellar/freighter-api";

const BACKEND_URL = 'https://ayuda-backend.onrender.com';

export interface ScanResponse {
  nfc_hash: string | null;
  is_fresh: boolean;
}

export interface ClaimResponse {
  xdr: string;
  status: string;
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

  register: async (name: string, addr: string) => {
    const res = await fetch(`${BACKEND_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizen_name: name,
        citizen_addr: addr,
      }),
    });
    return await res.json();
  },

  claim: async (beneficiaryAddr: string): Promise<string> => {
    // 1. Get the XDR from the backend
    const res = await fetch(`${BACKEND_URL}/api/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        beneficiary_addr: beneficiaryAddr,
      }),
    });

    const data: ClaimResponse = await res.json();

    if (!data.xdr) {
      throw new Error(data.status || "Failed to generate claim transaction");
    }

    // 2. Trigger the Freighter Pop-up
    // This will return the signed XDR
    const signedXdr = await signTransaction(data.xdr, {
      network: "TESTNET",
    });

    return signedXdr;
  }
};
