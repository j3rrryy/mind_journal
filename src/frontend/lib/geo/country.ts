import { Reader, CountryResponse, open } from "maxmind";
import path from "path";
import fs from "fs";

let lookup: Reader<CountryResponse> | null = null;
let loading: Promise<void> | null = null;

export async function getCountryLookup() {
  if (lookup) return lookup;

  if (loading) {
    await loading;
    return lookup;
  }

  loading = (async () => {
    try {
      const dbPath = path.join(process.cwd(), "lib/geo/GeoLite2-Country.mmdb");

      if (!fs.existsSync(dbPath)) {
        return;
      }

      lookup = await open<CountryResponse>(dbPath);
    } finally {
      loading = null;
    }
  })();

  await loading;
  return lookup;
}

export async function getCountryCode(ip: string): Promise<string | null> {
  try {
    const cleanIp = ip.split(",")[0].trim();

    if (
      cleanIp === "127.0.0.1" ||
      cleanIp === "::1" ||
      cleanIp.startsWith("192.168.") ||
      cleanIp.startsWith("10.") ||
      cleanIp.startsWith("172.16.") ||
      cleanIp.startsWith("172.17.") ||
      cleanIp.startsWith("172.18.") ||
      cleanIp.startsWith("172.19.") ||
      cleanIp.startsWith("172.20.")
    ) {
      return null;
    }

    const lookup = await getCountryLookup();
    if (!lookup) return null;

    const result = lookup.get(cleanIp);
    return result?.country?.iso_code || null;
  } catch {
    return null;
  }
}
