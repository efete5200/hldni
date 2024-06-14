"use server";

import { z } from "zod";

import { phoneNumberSchema } from "@/config/validator";
import { getSerial, setSerial } from "@/server/controller/redis";
import { makeSerial } from "@/server/service";
import { IAuthenticateMsg, IReserveMsg, IrequestSnsMsg } from "@/types";
import { Prisma } from "@prisma/client";
import db from "@/config/db";

const formatPhoneNumber = (input: string) => {
  const cleanInput = input.replaceAll(/[^0-9]/g, "");
  let result = "";
  const length = cleanInput.length;
  if (length === 8) {
    result = cleanInput.replace(/(\d{4})(\d{4})/, "$1-$2");
  } else if (cleanInput.startsWith("02") && (length === 9 || length === 10)) {
    result = cleanInput.replace(/(\d{2})(\d{3,4})(\d{4})/, "$1-$2-$3");
  } else if (!cleanInput.startsWith("02") && (length === 10 || length === 11)) {
    result = cleanInput.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  } else {
    result = "";
  }
  return result;
};

type UserInfo = {
  name: string;
  phoneNumber: string;
  agreement1: boolean;
  agreement2: boolean;
};

export const reserveUser = async (userInfo: UserInfo) => {
  if (!userInfo.agreement1) return IReserveMsg.FAIL;

  try {
    await db.user.create({
      data: userInfo,
    });
    return IReserveMsg.SUCCESS;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return IReserveMsg.FAIL_DUPLICATED;
      }
    }
    return IReserveMsg.FAIL;
  }
};

export const requestCertify = async (
  rawPhoneNumber: string
): Promise<IrequestSnsMsg | string> => {
  try {
    const phoneNumber = formatPhoneNumber(rawPhoneNumber);

    const user = await db.user.findUnique({ where: { phoneNumber } });
    if (user) return IrequestSnsMsg.FAIL_DUPLICATED;

    phoneNumberSchema.parse(phoneNumber);

    const serial = makeSerial();
    await setSerial(phoneNumber, serial);

    // return IrequestSnsMsg.SUCCESS;
    return serial;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return IrequestSnsMsg.FAIL_INVALID;
    }
    return IrequestSnsMsg.FAIL;
  }
};

export const authenticate = async (
  rawPhoneNumber: string,
  serial: string
): Promise<IAuthenticateMsg> => {
  try {
    const phoneNumber = formatPhoneNumber(rawPhoneNumber);
    const saved = await getSerial(phoneNumber);

    console.log(serial);
    if (!saved || saved.toString() !== serial)
      return IAuthenticateMsg.FAIL_AUTH;

    return IAuthenticateMsg.SUCCESS;
  } catch (error) {
    return IAuthenticateMsg.FAIL_SERVER;
  }
};
