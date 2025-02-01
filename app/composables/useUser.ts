// import { bytesToHex } from "@noble/hashes/utils";
// import { useStorage } from "@vueuse/core";
// import { generateSecretKey, getPublicKey } from "nostr-tools";

export default () => {
  //   const { $wipeDexie } = useNuxtApp();
  // const { fetch: fetchProfile } = useUserSession();

  //   const loggedIn = useStorage("loggedIn", false);
  //   const certs = useStorage<UserCerts>("current-certs", { pub: "", priv: "" });
  //   const userRole = useStorage<UserRole>("current-role", "NewComer");
  //   const profile = useStorage<UserProfile>("current-user", {
  //     firstName: "",
  //     lastName: "",
  //     displayName: "",
  //     userName: "",
  //     about: "",
  //     email: "",
  //     avatar: "",
  //   });
  //   const userPub = useCookie("userPub", {
  //     default: () => "",
  //     maxAge: cookieExpire,
  //     watch: true,
  //   });

  //   const registerNew = async () => {
  //     if (!loggedIn.value) {
  //       const priv = generateSecretKey(); // `sk` is a hex string
  //       const pub = getPublicKey(priv); // `pk` is a hex string
  //       const randomName = GenerateIdentity(pub, "fa");

  //       const newUser = {
  //         firstName: randomName.split(" ")[0]!,
  //         lastName: randomName.slice(randomName.split(" ")[0]?.length),
  //         displayName: randomName,
  //         userName: "",
  //         about: `یک ${randomName} تازه وارد :)`,
  //         email: "",
  //         avatar: "",
  //       };
  //       certs.value = {
  //         pub,
  //         priv: bytesToHex(priv),
  //       };
  //       profile.value = newUser;
  //       userPub.value = pub;
  //       await registerToServer(newUser, pub);
  //           await fetchProfile();

  //       loggedIn.value = true;
  //       // await whoAmI();
  //     }
  //   };
  //   const registerToServer = async (newUser: any, pub: string) => {
  //     //     await $fetch("/api/member/register", {
  //     //   method: "POST",
  //     //   body: JSON.stringify({
  //     //     firstName: event.data.firstName,
  //     //     lastName: event.data.lastName,
  //     //     about: event.data.about,
  //     //     userName: event.data.userName,
  //     //     password: event.data.password,
  //     //   }),
  //     // });
  //     // await $fetch("/serverless-api/members/register", {
  //     //   method: "post",
  //     //   body: {
  //     //     firstName: newUser.firstName,
  //     //     lastName: newUser.lastName,
  //     //     displayName: newUser.displayName,
  //     //     userName: newUser.userName,
  //     //     about: newUser.about,
  //     //     email: newUser.email,
  //     //     avatar: newUser.avatar,
  //     //     pub: pub,
  //     //   },
  //     // });
  //   };

  //   const login = async (userAuth: any) => {
  //         await $fetch("/api/member/login", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         userName: event.data.userName,
  //         password: event.data.password,
  //       }),
  //     });
  //     // console.log(userAuth);
  //     // profile.value = {
  //     //   firstName: userAuth.firstName,
  //     //   lastName: userAuth.lastName,
  //     //   displayName: userAuth.displayName,
  //     //   userName: userAuth.userName,
  //     //   about: userAuth.about,
  //     //   email: userAuth.email,
  //     //   avatar: userAuth.avatar,
  //     // };
  //     // certs.value = {
  //     //   pub: userAuth.pub,
  //     //   priv: userAuth.priv,
  //     // };

  //     // userPub.value = userAuth.pub;
  //     // loggedIn.value = true;
  //     // await whoAmI();
  //   };

  return {
    // login,
    // loggedIn,
    // certs,
    // profile,
    // registerNew,
    // userRole,
  };
};
