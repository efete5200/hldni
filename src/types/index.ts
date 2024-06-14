export enum ICertifyButton {
  REQUEST = "인증 요청",
  AUTH = "인증하기",
  COMPLETE = "인증 완료",
}

export enum IrequestSnsMsg {
  SUCCESS = "요청하였습니다.",
  FAIL = "요청에 실패했습니다. 잠시 후 다시 시도해주세요.",
  FAIL_INVALID = "휴대폰 번호는 010, 011, 016, 017, 018, 019로 시작하는 10~11자리 숫자여야 합니다.",
}

export enum IAuthenticateMsg {
  SUCCESS = "인증이 완료되었습니다.",
  FAIL_AUTH = "인증에 실패하였습니다. 다시 시도해주세요.",
  FAIL_SERVER = "서버 오류입니다. 잠시 후 다시 시도해주세요.",
}

export enum IReserveMsg {
  SUCCESS = "상담이 예약되었습니다.",
  FAIL = "상담 예약이 실패했습니다.",
  FAIL_DUPLICATED = "이미 상담 예약이 완료된 휴대폰 번호입니다.",
}
