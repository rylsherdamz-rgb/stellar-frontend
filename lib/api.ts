import { isConnected, requestAccess, signTransaction } from "@stellar/freighter-api";

const BACKEND_URL = " https://ayuda-backend.onrender.com"

// '';

export interface ScanResponse {
  nfc_hash: string | null;
  is_fresh: boolean;
}

export interface TxResponse {
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

  register: async (name: string, addr: string): Promise<string> => {
    // 1. Get the unsigned Registration XDR from backend
    const res = await fetch(`${BACKEND_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        citizen_name: name,
        citizen_addr: addr,
      }),
    });

    const data: TxResponse = await res.json();

    if (!data.xdr) {
      // throw new Error(data.status || "Failed to generate registration transaction");
    }

    // 2. Trigger Admin signature pop-up
    const signedXdr = await signTransaction(data.xdr, {
      network: "TESTNET",
    });

    return signedXdr;
  },

  claim: async (beneficiaryAddr: string): Promise<string> => {
    // 1. Get the unsigned Claim XDR from backend
    const res = await fetch(`${BACKEND_URL}/api/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        beneficiary_addr: beneficiaryAddr,
      }),
    });

    const data: TxResponse = await res.json();

    if (!data.xdr) {
      throw new Error(data.status || "Failed to generate claim transaction");
    }

    // 2. Trigger Beneficiary signature pop-up
    const signedXdr = await signTransaction(data.xdr, {
      network: "TESTNET",
    });

    return signedXdr;
  }
};
