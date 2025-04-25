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
 * create random adjective + animal names based on locale
 */
export const GenerateIdentity = async (
  locale: string = "en"
): Promise<string> => {
  const jungles = await loadJungles();

  const adjectives =
    locale === "fa" ? jungles.adjectivesFa : jungles.adjectivesEn;
  const animals = locale === "fa" ? jungles.animalsFa : jungles.animalsEn;

  const randomIndex = (array: any[]) =>
    Math.floor(Math.random() * array.length);
  const adjective = adjectives[randomIndex(adjectives)];
  const animal = animals[randomIndex(animals)];

  return locale === "fa"
    ? `${capitalize(animal)} ${capitalize(adjective)}`
    : `${capitalize(adjective)} ${capitalize(animal)}`;
};
