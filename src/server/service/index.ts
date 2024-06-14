export const makeSerial = () => {
  const randomNumber = Math.floor(Math.random() * 1000000);
  return randomNumber.toString().padStart(6, "0");
};

export function formatGMTDate(gmtDate: Date) {
  const date = new Date(gmtDate);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const formattedDate = `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;

  return formattedDate;
}
