import fetch from "node-fetch";
// import { firebaseCredential } from "../../../express";

const APPLICATION = "com.bixink.wepeach";
const SERVER_KEY =
  "AAAArUz7SOo:APA91bE2uoj-a9kvBNznQyXqEvZhwG5ZhyPZJ9MB-cE4uiFlEhYXYlUHEPRyV8Y39o0AnO71n7q1RM6T_CNYJYN6g9wFOkSSYZyfmndwJyCvWB0QNo5h0AV-A0kV6JKNEuJr2e0v4sJR";

export async function apnTokenToFcmToken(apnToken) {
  try {
    // const accessToken = await firebaseCredential.getAccessToken();

    const url = `https://iid.googleapis.com/iid/v1:batchImport`;

    const init = {
      method: "POST",
      headers: {
        Authorization: `key=${SERVER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        application: APPLICATION,
        sandbox: true,
        apns_tokens: [apnToken],
      }),
    };

    const res = await fetch(url, init);
    const data = await res.json();

    return data.results[0].registration_token;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
