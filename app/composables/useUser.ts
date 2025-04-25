import { schnorr } from "@noble/curves/secp256k1";
import { bytesToHex } from "@noble/hashes/utils";
import { useStorage } from "@vueuse/core";

// Define Profile interface for type safety
interface Profile {
  firstName: string;
  lastName: string;
  displayName: string;
  about: string;
  pub: string;
  deviceName: string;
}

export default () => {
  const { locale } = useI18n();

  // Profile cookie with typed default values
  const profile = useCookie<Profile>("current-user", {
    default: () => ({
      firstName: "",
      lastName: "",
      displayName: "",
      about: "",
      pub: "",
      deviceName: "",
    }),
    watch: true,
  });

  // Login state
  const loggedIn = useCookie("loggedIn", {
    default: () => false,
    watch: true,
  });

  // Device private key storage
  const devicePriv = useStorage("device-priv", "");

  // Generate a new secret key
  const generateSecretKey = (): Uint8Array => {
    return schnorr.utils.randomPrivateKey();
  };

  // Derive public key from secret key
  const getPublicKey = (secretKey: Uint8Array): string => {
    return bytesToHex(schnorr.getPublicKey(secretKey));
  };

  // Core function to set up a new identity
  const setupNewIdentity = async () => {
    const privKey = generateSecretKey();
    const privHex = bytesToHex(privKey);
    const pub = getPublicKey(privKey);
    const deviceName = await GenerateIdentity(locale.value);

    const [firstWord, ...rest] = deviceName.split(" ");
    const lastName = rest.join(" ").trim();

    profile.value = {
      firstName: firstWord,
      lastName,
      displayName: deviceName,
      about:
        locale.value === "en"
          ? `A ${deviceName} newcomer :)`
          : `یک ${deviceName} تازه‌وارد :)`,
      pub,
      deviceName,
    };

    devicePriv.value = privHex;
    loggedIn.value = true;
  };

  // Initialize device only if not logged in
  const initDevice = () => {
    if (!loggedIn.value) {
      setupNewIdentity();
    }
  };

  // Login with partial profile updates
  const login = (newProfileData: Partial<Profile>) => {
    profile.value = {
      ...profile.value,
      ...newProfileData,
    };
    loggedIn.value = true;
  };

  // Logout and reset all data
  const logout = () => {
    profile.value = {
      firstName: "",
      lastName: "",
      displayName: "",
      about: "",
      pub: "",
      deviceName: "",
    };
    devicePriv.value = "";
    loggedIn.value = false;
  };

  // Generate a new identity with new keys and profile data
  const generateNewNames = async () => {
    const deviceName = await GenerateIdentity(locale.value);

    const [firstWord, ...rest] = deviceName.split(" ");
    const lastName = rest.join(" ").trim();

    profile.value = {
      firstName: firstWord,
      lastName,
      displayName: deviceName,
      about:
        locale.value === "en"
          ? `A ${deviceName} newcomer :)`
          : `یک ${deviceName} تازه‌وارد :)`,
      deviceName,
      pub: profile.value.pub,
    };
  };

  return {
    profile,
    loggedIn,
    login,
    logout,
    initDevice,
    generateNewNames,
  };
};
