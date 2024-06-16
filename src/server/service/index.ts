import { fetchToken, sendSms } from "../controller/ppurio";
import { getSnsToken, setSnsToken } from "../controller/redis";

export const requestMsg = async (phoneNumber: string, serial: string) => {
  let token: string | null = await getSnsToken();
  if (!token) {
    token = await fetchToken();
    if (token) await setSnsToken(token);
  }
  await sendSms(token, phoneNumber, serial);
};
