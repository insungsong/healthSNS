import fetch from "node-fetch";

export const getKakaoUser = async (accessToken) => {
  // const url = `https://kapi.kakao.com/v2/user/me`;

  const res = await fetch(`https://kapi.kakao.com/v2/user/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // const res = await fetch(url, init);
  const data = await res.json();

  const id = data.id;
  const email = data.kakao_account.email || data.id + "@kakao";
  const picture = data.kakao_account.profile.profile_image_url;
  const name = data.kakao_account.profile.nickname;

  if (!id || !email) {
    throw new Error("Invalid kakao access token.");
  }

  return { id, email, name, picture };
};
