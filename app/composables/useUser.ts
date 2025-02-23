import { bytesToHex } from "@noble/hashes/utils";
import { generateSecretKey, getPublicKey } from "nostr-tools";

export default () => {
  const { locale } = useI18n();
  const profile = useCookie("current-user", {
    default: () => ({
      firstName: "",
      lastName: "",
      displayName: "",
      about: "",
    }),
    watch: true,
  });
  const loggedIn = useCookie("loggedIn", {
    default: () => false,
    watch: true,
  });
  const registerNew = async () => {
    if (!loggedIn.value) {
      const priv = generateSecretKey(); // `sk` is a hex string
      const pub = getPublicKey(priv); // `pk` is a hex string
      const randomName = GenerateIdentity(pub, locale.value);

      const newUser = {
        firstName: randomName.split(" ")[0]!,
        lastName: randomName.slice(randomName.split(" ")[0]?.length),
        displayName: randomName,
        about: `یک ${randomName} تازه وارد :)`,
        pub,
        priv: bytesToHex(priv),
      };

      profile.value = newUser;
      loggedIn.value = true;
    }
  };
  return {
    registerNew,
    profile,
  };
};
