import { bytesToHex } from "@noble/hashes/utils";
import { useStorage } from "@vueuse/core";
import { generateSecretKey, getPublicKey } from "nostr-tools";
import { useI18n } from "vue-i18n";

// Assume GenerateIdentity is available in your project to generate a device name based on the public key and locale.

export default () => {
  const { locale } = useI18n();

  const profile = useCookie("current-user", {
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

  const loggedIn = useCookie("loggedIn", {
    default: () => false,
    watch: true,
  });
  const devicePriv = useStorage("device-priv", "");

  // Generate keys and device info on app boot if not already set.
  const initDevice = () => {
    if (!loggedIn.value) {
      const privKey = generateSecretKey(); // Generates a Uint8Array secret key
      const privHex = bytesToHex(privKey); // Convert to hex string
      const pub = getPublicKey(privKey); // Get corresponding public key

      // Generate a device identity (deviceName) based on the public key and locale.
      const randomName: any = GenerateIdentity(pub, locale.value);

      // Update the profile with generated keys and device data.
      profile.value = {
        ...profile.value,
        firstName: randomName.split(" ")[0],
        lastName: randomName.slice(randomName.split(" ")[0].length).trim(),
        displayName: randomName,
        about:
          locale.value === "en"
            ? `un ${randomName} new comer :)`
            : `یک ${randomName} تازه وارد :)`,
        pub,
        deviceName: randomName,
      };
      devicePriv.value = privHex;
    }
    loggedIn.value = true;
  };

  // Login: update profile data without modifying the existing keys.
  const login = (newProfileData: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    about?: string;
  }) => {
    profile.value = {
      ...profile.value,
      ...newProfileData,
    };
    loggedIn.value = true;
  };

  // Logout: clear profile data so that a new device (key pair) is generated on next boot.
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
  watch(loggedIn, () => {
    if (!loggedIn.value) {
      initDevice();
    }
  });
  return {
    profile,
    loggedIn,
    login,
    logout,
    initDevice,
  };
};
