export async function generateCredentialCode(
  studentName: string,
  studentAddress: string
): Promise<string> {
  const normalizedName = studentName.trim().toLowerCase();
  const normalizedAddress = studentAddress.trim().toLowerCase();

  if (!normalizedName || !normalizedAddress) {
    return "";
  }

  const encoder = new TextEncoder();
  const source = `${normalizedName}::${normalizedAddress}`;
  const data = encoder.encode(source);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
