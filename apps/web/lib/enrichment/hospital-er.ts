import { HospitalERResult } from "@eldersteady/shared-types";
import { tinyfishSearch, tinyfishFetch } from "../tinyfish";

export async function fetchHospitalER(pincode: string = "560038"): Promise<HospitalERResult> {
  const query = `Apollo Hospital Indiranagar Bangalore ER wait time emergency status ${pincode}`;
  const searchResults = await tinyfishSearch(query);

  let waitMinutes = 12;
  let isEstimated = true;
  let sourceUrl = "https://www.apollohospitals.com/bangalore/indiranagar";

  if (searchResults.length > 0) {
    sourceUrl = searchResults[0].url || sourceUrl;
    // Attempt to fetch content if available
    try {
      const page = await tinyfishFetch(sourceUrl);
      if (page.content) {
        // Look for wait time patterns in text
        const match = page.content.match(/(\d+)\s*(?:min|mins|minutes)\s*(?:wait|queue|triage)/i);
        if (match) {
          waitMinutes = parseInt(match[1], 10);
          isEstimated = false;
        }
      }
    } catch {
      // Keep estimated default
    }
  }

  return {
    hospitalName: "Apollo Hospital — Indiranagar",
    waitMinutes,
    distanceKm: 1.8,
    emergencyPhone: "+91 80 4668 8888",
    isEstimated,
    sourceUrl,
    lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}
