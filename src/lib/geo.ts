/**
 * Nigeria's official first-level administrative divisions: 36 states plus the
 * Federal Capital Territory. Codes follow ISO 3166-2:NG.
 *
 * This is reference data, not content — the real platform resolves State → LGA
 * → Town from a fuller dataset (774 LGAs). The prototype only needs the state
 * layer, for the waitlist and the geography explainer.
 */

export type NigerianState = {
  code: string;
  name: string;
  /** Geopolitical zone — used to group the map legend. */
  zone: Zone;
  /** Number of Local Government Areas in the state. */
  lgas: number;
};

export type Zone =
  | "North Central"
  | "North East"
  | "North West"
  | "South East"
  | "South South"
  | "South West";

export const NIGERIAN_STATES: NigerianState[] = [
  { code: "AB", name: "Abia", zone: "South East", lgas: 17 },
  { code: "AD", name: "Adamawa", zone: "North East", lgas: 21 },
  { code: "AK", name: "Akwa Ibom", zone: "South South", lgas: 31 },
  { code: "AN", name: "Anambra", zone: "South East", lgas: 21 },
  { code: "BA", name: "Bauchi", zone: "North East", lgas: 20 },
  { code: "BY", name: "Bayelsa", zone: "South South", lgas: 8 },
  { code: "BE", name: "Benue", zone: "North Central", lgas: 23 },
  { code: "BO", name: "Borno", zone: "North East", lgas: 27 },
  { code: "CR", name: "Cross River", zone: "South South", lgas: 18 },
  { code: "DE", name: "Delta", zone: "South South", lgas: 25 },
  { code: "EB", name: "Ebonyi", zone: "South East", lgas: 13 },
  { code: "ED", name: "Edo", zone: "South South", lgas: 18 },
  { code: "EK", name: "Ekiti", zone: "South West", lgas: 16 },
  { code: "EN", name: "Enugu", zone: "South East", lgas: 17 },
  { code: "FC", name: "Federal Capital Territory", zone: "North Central", lgas: 6 },
  { code: "GO", name: "Gombe", zone: "North East", lgas: 11 },
  { code: "IM", name: "Imo", zone: "South East", lgas: 27 },
  { code: "JI", name: "Jigawa", zone: "North West", lgas: 27 },
  { code: "KD", name: "Kaduna", zone: "North West", lgas: 23 },
  { code: "KN", name: "Kano", zone: "North West", lgas: 44 },
  { code: "KT", name: "Katsina", zone: "North West", lgas: 34 },
  { code: "KE", name: "Kebbi", zone: "North West", lgas: 21 },
  { code: "KO", name: "Kogi", zone: "North Central", lgas: 21 },
  { code: "KW", name: "Kwara", zone: "North Central", lgas: 16 },
  { code: "LA", name: "Lagos", zone: "South West", lgas: 20 },
  { code: "NA", name: "Nasarawa", zone: "North Central", lgas: 13 },
  { code: "NI", name: "Niger", zone: "North Central", lgas: 25 },
  { code: "OG", name: "Ogun", zone: "South West", lgas: 20 },
  { code: "ON", name: "Ondo", zone: "South West", lgas: 18 },
  { code: "OS", name: "Osun", zone: "South West", lgas: 30 },
  { code: "OY", name: "Oyo", zone: "South West", lgas: 33 },
  { code: "PL", name: "Plateau", zone: "North Central", lgas: 17 },
  { code: "RI", name: "Rivers", zone: "South South", lgas: 23 },
  { code: "SO", name: "Sokoto", zone: "North West", lgas: 23 },
  { code: "TA", name: "Taraba", zone: "North East", lgas: 16 },
  { code: "YO", name: "Yobe", zone: "North East", lgas: 17 },
  { code: "ZA", name: "Zamfara", zone: "North West", lgas: 14 },
];

export const STATE_CODES = new Set(NIGERIAN_STATES.map((s) => s.code));

export const TOTAL_LGAS = NIGERIAN_STATES.reduce((sum, s) => sum + s.lgas, 0);

export function stateByCode(code: string): NigerianState | undefined {
  return NIGERIAN_STATES.find((s) => s.code === code);
}

/**
 * A handful of LGAs and towns per sample state, used only to make the geography
 * explainer and the interface preview feel real. Not a complete dataset.
 */
export const SAMPLE_LOCALITIES: Record<
  string,
  { lga: string; towns: string[] }[]
> = {
  EN: [
    { lga: "Nsukka", towns: ["Nsukka", "Obukpa", "Opi"] },
    { lga: "Enugu North", towns: ["Ogui", "New Haven", "Asata"] },
    { lga: "Udi", towns: ["Udi", "Ngwo", "Abor"] },
  ],
  LA: [
    { lga: "Eti-Osa", towns: ["Lekki", "Victoria Island", "Ikoyi"] },
    { lga: "Ikeja", towns: ["Ikeja GRA", "Opebi", "Allen"] },
    { lga: "Alimosho", towns: ["Egbeda", "Ikotun", "Igando"] },
  ],
  KN: [
    { lga: "Nassarawa", towns: ["Hotoro", "Gwagwarwa", "Tudun Wada"] },
    { lga: "Fagge", towns: ["Sabon Gari", "Fagge", "Rijiyar Lemo"] },
  ],
  RI: [
    { lga: "Port Harcourt", towns: ["Old GRA", "Diobu", "Rumuomasi"] },
    { lga: "Obio-Akpor", towns: ["Rumuokoro", "Choba", "Rumuola"] },
  ],
};
