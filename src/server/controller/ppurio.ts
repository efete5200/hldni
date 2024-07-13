import axios from "axios";
import url from "url";
const fixieUrl = url.parse(process.env.FIXIE_URL as string);
const fixieAuth = (fixieUrl.auth as string).split(":");

const instance = axios.create({
  proxy: {
    protocol: "http",
    host: fixieUrl.hostname as string,
    port: Number(fixieUrl.port),
    auth: { username: fixieAuth[0], password: fixieAuth[1] },
  },
});

export const fetchToken = async (): Promise<string> => {
  const url = "https://message.ppurio.com/v1/token";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(
      (process.env.PPURIO_ACCOUNT + ":" + process.env.PPURIO_KEY) as string
    )} `,
  };

  try {
    const response = await instance.post(url, {}, { headers });
    return response.data.token;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      `Failed to get access token: ${error.response?.statusText}`
    );
  }

  // const response = await fetch(url, {
  //   method: "POST",
  //   headers: headers,
  // });

  // if (!response.ok) {
  //   console.log(response);
  //   throw new Error(`Failed to get access token: ${response.statusText}`);
  // }

  // const data = await response.json();
  // return data.token;
};

export const sendSms = async (
  token: string,
  phoneNumber: string,
  serial: string
) => {
  const url = "https://message.ppurio.com/v1/message";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const body = JSON.stringify({
    account: process.env.PPURIO_ACCOUNT,
    messageType: "SMS",
    content: `인증번호는 ${serial} 입니다.`,
    from: process.env.PPURIO_PHONE_NUMBER,
    duplicateFlag: "N",
    targetCount: 1,
    targets: [
      {
        to: phoneNumber,
      },
    ],
    refKey: `ref-${serial}`,
    subject: "인증번호",
  });

  try {
    const response = await instance.post(url, body, { headers });
    return;
  } catch (error: any) {
    console.error(error.response?.data);
    throw new Error(`Failed to send SMS: ${error.response?.statusText}`);
  }

  // const response = await fetch(url, {
  //   method: "POST",
  //   headers: headers,
  //   body: body,
  // });

  // if (!response.ok) {
  //   const json = await response.json();
  //   console.log(json);
  //   throw new Error(`Failed to send SMS: ${response.statusText}`);
  // }
};
