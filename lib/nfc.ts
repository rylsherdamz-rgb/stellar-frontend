export async function scanNfc(): Promise<string> {
  // 1. Check if the browser supports NFC
  if (!("NDEFReader" in window)) {
    throw new Error("NFC is not supported on this browser. Use Chrome on Android.");
  }

  try {
    // @ts-ignore - NDEFReader is not in standard TS types yet
    const ndef = new NDEFReader();

    // 2. Start scanning
    await ndef.scan();

    return new Promise((resolve, reject) => {
      // 3. Set up the listener for when a card is tapped
      ndef.onreading = async (event: any) => {
        const serialNumber = event.serialNumber;

        // 4. Hash the serial number immediately for privacy
        const hashedId = await hashSerial(serialNumber);
        resolve(hashedId);
      };

      ndef.onreadingerror = () => {
        reject("Could not read the NFC card. Try again.");
      };
    });
  } catch (error) {
    throw new Error("NFC Permission denied or hardware busy.");
  }
}

// SHA-256 Hashing Utility
async function hashSerial(serial: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(serial);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Convert buffer to hex string
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
