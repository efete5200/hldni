export const fetchToken = async (): Promise<string> => {
  const url = "https://api.bizppurio.com/v1/token";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${process.env.PPURIO_KEY}`,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
  });

  if (!response.ok) {
    console.log(response);
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.token;
};

export const sendSms = async (
  token: string,
  phoneNumber: string,
  serial: string
) => {
  const url = "https://api.bizppurio.com/v1/message";
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
  });

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  });

  if (!response.ok) {
    throw new Error(`Failed to send SMS: ${response.statusText}`);
  }

  console.log("SMS sent successsfully");
};
