import { fetchToken, sendSms } from "../controller/ppurio";
import { deleteSerial, getSnsToken, setSnsToken } from "../controller/redis";

export const requestMsg = async (phoneNumber: string, serial: string) => {
  try {
    let token: string | null = await getSnsToken();
    if (!token) {
      token = await fetchToken();
      if (token) await setSnsToken(token);
    }

    await sendSms(token, phoneNumber, serial);
  } catch (error) {
    console.log(error);
    deleteSerial("token");
    throw error;
  }
};
