type NdefReadingEvent = {
  serialNumber: string;
};

type BrowserNdefReader = {
  scan: () => Promise<void>;
  onreading: ((event: NdefReadingEvent) => void) | null;
  onreadingerror: (() => void) | null;
};

type WindowWithNdef = Window & {
  NDEFReader?: new () => BrowserNdefReader;
};

export async function scanNfc(): Promise<string> {
  const browserWindow = window as WindowWithNdef;
  const Reader = browserWindow.NDEFReader;

  if (!Reader) {
    throw new Error("NFC is not supported on this browser. Use Chrome on Android.");
  }

  try {
    const ndef = new Reader();
    await ndef.scan();

    return await new Promise((resolve, reject) => {
      ndef.onreading = async (event) => {
        const hashedId = await hashSerial(event.serialNumber);
        resolve(hashedId);
      };

      ndef.onreadingerror = () => {
        reject(new Error("Could not read the NFC card. Try again."));
      };
    });
  } catch {
    throw new Error("NFC permission denied or hardware busy.");
  }
}

async function hashSerial(serial: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(serial);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
