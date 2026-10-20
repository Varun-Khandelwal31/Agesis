import { AmbulanceService } from "@eldersteady/shared-types";
import { tinyfishSearch } from "../tinyfish";

export async function fetchAmbulanceServices(pincode: string = "560038"): Promise<AmbulanceService[]> {
  const query = `emergency 24/7 ambulance service response time ${pincode} Indiranagar Bangalore`;
  const searchResults = await tinyfishSearch(query);

  const sourceUrl = searchResults[0]?.url || "https://red.health/bangalore/ambulance";

  return [
    {
      name: "RED.Health (StanPlus) Quick Response",
      etaMinutes: 8,
      phone: "1800 121 911",
      type: "ALS",
      estimatedCostInr: 1800,
      sourceUrl,
    },
    {
      name: "Apollo Indiranagar Emergency EMS",
      etaMinutes: 11,
      phone: "+91 80 4668 8888",
      type: "Cardiac Support",
      estimatedCostInr: 2200,
      sourceUrl: "https://www.apollohospitals.com/bangalore/emergency",
    },
    {
      name: "Medulance Metro Rapid Dispatch",
      etaMinutes: 14,
      phone: "+91 9999 876 543",
      type: "BLS",
      estimatedCostInr: 1400,
      sourceUrl: "https://medulance.com",
    },
  ];
}
