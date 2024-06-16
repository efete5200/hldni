export const makeSerial = () => {
  const randomNumber = Math.floor(Math.random() * 1000000);
  return randomNumber.toString().padStart(6, "0");
};

export function formatGMTDate(gmtDate: Date) {
  const date = new Date(gmtDate);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedDate = `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;

  return formattedDate;
}
