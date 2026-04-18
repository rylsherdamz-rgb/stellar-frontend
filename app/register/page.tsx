import { useState, useEffect } from 'react';

export default function RegisterPage() {
  const [nfcHash, setNfcHash] = useState("");
  const [citizenAddr, setCitizenAddr] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [status, setStatus] = useState("Ready");

  const BACKEND_URL = "https://your-backend.onrender.com";

  // --- LAPTOP LOGIC: Poll for the latest scan ---
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/latest-scan`);
        const data = await res.json();
        if (data.nfc_hash) {
          setNfcHash(data.nfc_hash);
          setStatus("Card Detected!");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, []);

  // --- PHONE LOGIC: The actual NFC Scan ---
  const startMobileScan = async () => {
    if (!('NDEFReader' in window)) {
      alert("NFC not supported on this browser/device.");
      return;
    }

    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      setStatus("Scanning... Tap card to phone.");

      ndef.onreading = async ({ serialNumber }) => {
        setNfcHash(serialNumber);
        // Immediately send to backend state
        await fetch(`${BACKEND_URL}/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nfc_hash: serialNumber })
        });
        setStatus("Scan sent to Laptop!");
      };
    } catch (error) {
      console.error(error);
      setStatus("Scan failed: " + error);
    }
  };

  // --- LAPTOP LOGIC: Finalize Registration ---
  const handleRegister = async () => {
    setStatus("Processing Blockchain Transaction...");
    try {
      const res = await fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizen_addr: citizenAddr,
          citizen_id: citizenId
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        setStatus("Success! Citizen registered on Stellar.");
        setNfcHash(""); // Clear for next scan
      } else {
        setStatus("Error: " + data.message);
      }
    } catch (err) {
      setStatus("Failed to connect to backend.");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <h2>Ayuda Admin Portal</h2>
      <hr />

      <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '10px' }}>
        <p><strong>System Status:</strong> {status}</p>

        {/* Mobile View Button */}
        <button
          onClick={startMobileScan}
          style={{ padding: '15px', width: '100%', marginBottom: '20px', backgroundColor: '#fff', color: '#000', fontWeight: 'bold' }}
        >
          📱 OPEN PHONE SCANNER
        </button>

        {/* Registration Form (Laptop View) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label>Scanned NFC Hash (From Phone):</label>
          <input value={nfcHash} readOnly style={{ padding: '10px', backgroundColor: '#222', color: '#0px' }} placeholder="Waiting for scan..." />

          <label>Student Wallet Address:</label>
          <input onChange={(e) => setCitizenAddr(e.target.value)} placeholder="G..." style={{ padding: '10px' }} />

          <label>Student Name / ID:</label>
          <input onChange={(e) => setCitizenId(e.target.value)} placeholder="Richie De Guzman" style={{ padding: '10px' }} />

          <button
            onClick={handleRegister}
            disabled={!nfcHash}
            style={{ padding: '15px', marginTop: '10px', backgroundColor: nfcHash ? '#00ff00' : '#444' }}
          >
            🚀 REGISTER ON BLOCKCHAIN
          </button>
        </div>
      </div>
    </div>
  );
}
