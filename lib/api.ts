const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export interface RegisterPayload {
  citizen_addr: string;
  citizen_name: string;
  nfc_hash?: string;
  amount: number;
}

export interface ClaimPayload {
  nfc_hash: string;
}

export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
  amount?: number;
  tx_hash?: string;
  details?: string;
}

export interface ScanResponse {
  nfc_hash: string | null;
  is_fresh: boolean;
}

export const AyudaAPI = {
  /**
   * Polls the backend for the most recent NFC scan captured by the phone.
   */
  getLatestScan: async (): Promise<ScanResponse> => {
    const res = await fetch(`${BACKEND_URL}/api/latest-scan`);
    if (!res.ok) throw new Error('Failed to fetch scan signal');
    return res.json();
  },

  /**
   * Admin-only: Commits a new identity to the ledger and funds it.
   */
  registerCitizen: async (payload: RegisterPayload): Promise<ApiResponse> => {
    const res = await fetch(`${BACKEND_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  /**
   * Beneficiary-only: Initiates the claim process using the NFC handshake.
   */
  claimAid: async (nfcHash: string): Promise<ApiResponse> => {
    const payload: ClaimPayload = { nfc_hash: nfcHash };
    const res = await fetch(`${BACKEND_URL}/api/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  /**
   * Utility: Checks health of the bridge connection.
   */
  checkHealth: async (): Promise<ApiResponse> => {
    const res = await fetch(`${BACKEND_URL}/api/health`);
    return res.json();
  }
};
