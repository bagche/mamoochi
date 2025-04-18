// import { sha256 } from "@noble/hashes/sha256";

// import JunglesJson from "~/assets/jungles.json";

function capitalize(s: any) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * deterministically create adjective + animal names
 */
// export const GenerateIdentity = (seed: any, lang = "fa") => {
//   if (!seed) {
//     throw new Error("No seed provided");
//   }
//   const hash = sha256(seed); // Uint8Array
//   const adjective =
//     lang == "fa"
//       ? JunglesJson.adjectivesFa[hash[0] % JunglesJson.adjectivesFa.length]
//       : JunglesJson.adjectivesEn[hash[0] % JunglesJson.adjectivesEn.length];
//   const animal =
//     lang == "fa"
//       ? JunglesJson.animalsFa[hash[1] % JunglesJson.animalsFa.length]
//       : JunglesJson.animalsEn[hash[1] % JunglesJson.animalsEn.length];
//   return lang == "fa"
//     ? `${capitalize(animal)} ${capitalize(adjective)}`
//     : `${capitalize(adjective)} ${capitalize(animal)}`;
// };
