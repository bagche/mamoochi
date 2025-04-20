import { sha256 } from "@noble/hashes/sha256";

let cachedJungles: typeof any | null = null;

function capitalize(s: any) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const loadJungles = async () => {
  if (cachedJungles) return cachedJungles;
  const response = await fetch("/data/jungles.json");
  cachedJungles = await response.json();
  return cachedJungles;
};
/**
 * deterministically create adjective + animal names
 */

export const GenerateIdentity = async (
  seed: string,
  lang: string = "fa"
): Promise<string> => {
  const jungles = await loadJungles();
  if (!seed) throw new Error("No seed provided");

  const hash = sha256(seed);
  const adjectives =
    lang === "fa" ? jungles.adjectivesFa : jungles.adjectivesEn;
  const animals = lang === "fa" ? jungles.animalsFa : jungles.animalsEn;

  const adjective = adjectives[hash[0] % adjectives.length];
  const animal = animals[hash[1] % animals.length];

  return lang === "fa"
    ? `${capitalize(animal)} ${capitalize(adjective)}`
    : `${capitalize(adjective)} ${capitalize(animal)}`;
};
