"use client";
import React, {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";

import {
  IAuthenticateMsg,
  ICertifyButton,
  IReserveMsg,
  IrequestSnsMsg,
} from "@/types";
import { activate, authenticate, requestCertify, reserveUser } from "./action";

import "../styles/reset.css";
import "../styles/style.css";
import "../styles/ha_newStyle.css";
import "../styles/style_edit.css";
import "../styles/interest.css";
import "../styles/addition.css";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const Page = () => {
  const [certifyButton, setCertifyButton] = useState<ICertifyButton>(
    ICertifyButton.REQUEST
  );
  const [name, setName] = useState("");
  const [certifiNumber, setCertifiNumber] = useState("");
  const [first, setFirst] = useState("");
  const [mid, setMid] = useState("");
  const [last, setLast] = useState("");
  const [agreement1, setAgreement1] = useState<boolean>(false);
  const [agreement2, setAgreement2] = useState<boolean>(false);

  const [dropbox1, setDropbox1] = useState(false);
  const [dropbox2, setDropbox2] = useState(false);

  const [time, setTime] = useState(360); // 6분 = 360초
  const [pending, setPending] = useState(false);

  const phoneNumber = `${first}-${mid}-${last}`;

  const HandleCertifyButton: MouseEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (certifyButton === ICertifyButton.REQUEST) {
      requestSNS();
    } else if (certifyButton === ICertifyButton.AUTH) {
      requestAuthenticate();
    }
  };

  const requestSNS = async () => {
    setPending(true);
    const msg: IrequestSnsMsg | string = await requestCertify(phoneNumber);
    setPending(false);
    if (msg === IrequestSnsMsg.SUCCESS) {
      setCertifyButton(ICertifyButton.AUTH);
      alert(msg);
      return;
    }

    alert(msg);
  };

  const requestAuthenticate = async () => {
    setPending(true);
    const msg: IAuthenticateMsg = await authenticate(
      phoneNumber,
      certifiNumber
    );
    setPending(false);
    if (msg === IAuthenticateMsg.SUCCESS) {
      setCertifyButton(ICertifyButton.COMPLETE);
      alert(msg);
      return;
    }

    alert(msg);
  };

  const handleAgreementChange1: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setAgreement1(event.target.checked);
  };

  const handleAgreementChange2: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setAgreement2(event.target.checked);
  };

  const handleSubmit: MouseEventHandler<HTMLInputElement> = async (e) => {
    if (name === "") {
      return alert("이름을 입력해야 합니다.");
    }
    if (certifyButton !== ICertifyButton.COMPLETE)
      return alert("휴대폰 인증을 먼저 진행해야 합니다.");
    if (!agreement1)
      return alert("(필수) 개인정보 수집 및 이용 등에 동의하셔야 합니다.");

    setPending(true);
    const response = await reserveUser({
      name,
      phoneNumber,
      agreement1,
      agreement2,
    });
    setPending(false);
    if (response === IReserveMsg.SUCCESS) {
      alert("등록이 완료되었습니다!");
      return window.location.reload();
    }

    alert(response);
  };

  useEffect(() => {
    activate();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (certifyButton === ICertifyButton.AUTH) {
      if (time > 0) {
        setTimeout(() => setTime((prev) => prev - 1), 1000);
      } else setCertifyButton(ICertifyButton.REQUEST);
    }
  }, [certifyButton, time]);

  return (
    <body className="flex justify-center">
      <div className="max-w-xl min-h-full min-w-[300px] bg-white">
        <div className="visual user">
          <a
            href="/"
            className="absolute top-7 left-[50%] transform translate-x-[-50%]"
          >
            <img
              src="/image/common/new_logo_black.png"
              data-white="/image/common/new_logo_white.png"
              data-black="/image/common/new_logo_black.png"
            />
          </a>
          <h1 className="visual_title">상담고객 등록</h1>
        </div>

        <main className="mx-6">
          <form>
            <div>
              <table className="w-full table">
                <tbody className="flex flex-col items-center">
                  <tr className="flex items-center w-[100%]">
                    <td className="heading w-10 mr-5">성명</td>
                    <td>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input_txt input_txt1"
                      />
                    </td>
                  </tr>
                  <tr className="flex items-center w-[100%]">
                    <td className="heading mr-3">연락처</td>
                    <td className="md:transform md:translate-x-4">
                      <input
                        type="text"
                        name="tel1"
                        id="tel1"
                        value={first}
                        onChange={(e) => setFirst(e.target.value)}
                        className="input_txt input_txt2 input_txt_first"
                        maxLength={3}
                        disabled={certifyButton !== ICertifyButton.REQUEST}
                      />
                      <span className="hyphen"></span>
                      <input
                        type="text"
                        name="tel2"
                        id="tel2"
                        value={mid}
                        onChange={(e) => setMid(e.target.value)}
                        className="input_txt input_txt2"
                        maxLength={4}
                        disabled={certifyButton !== ICertifyButton.REQUEST}
                      />
                      <span className="hyphen"></span>
                      <input
                        type="text"
                        name="tel3"
                        id="tel3"
                        value={last}
                        onChange={(e) => setLast(e.target.value)}
                        className="input_txt input_txt2 input_txt_last"
                        maxLength={4}
                        disabled={certifyButton !== ICertifyButton.REQUEST}
                      />
                      <div className="auth_wrap">
                        <input
                          type="text"
                          name="auth"
                          id="auth"
                          className="input_txt input_txt4 input_txt_first"
                          value={certifiNumber}
                          onChange={(e) => setCertifiNumber(e.target.value)}
                          disabled={certifyButton !== ICertifyButton.AUTH}
                        />
                        {certifyButton === ICertifyButton.AUTH && (
                          <span className="timer">{formatTime(time)}</span>
                        )}
                        <input
                          type="button"
                          className="auth_btn"
                          value={certifyButton}
                          onClick={HandleCertifyButton}
                          disabled={
                            pending || certifyButton === ICertifyButton.COMPLETE
                          }
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div className="chk_all mt-0 sm:mt-[80px] mb-0">
                <span>
                  <input
                    type="checkbox"
                    id="chk_all"
                    name="chk_all"
                    checked={agreement1 && agreement2}
                    onChange={(e) => {
                      if (!agreement1 || !agreement2) {
                        setAgreement1(true);
                        setAgreement2(true);
                      }
                    }}
                  />
                  <label htmlFor="chk_all">
                    개인정보수집 및 이용에 모두 동의합니다.
                  </label>
                </span>
              </div>

              <div className="privacy">
                <div className="flex justify-between sm:mx-10">
                  <h3>(필수) 개인정보수집 및 이용 등에 대한 동의</h3>
                  <span className="">
                    <input
                      name="agree_prv"
                      type="checkbox"
                      id="agree_prv_y"
                      checked={agreement1}
                      onChange={handleAgreementChange1}
                    />
                    <label htmlFor="agree_prv_y"></label>
                  </span>
                </div>
                <h3
                  className="flex justify-between items-center text-[15px] sm:mx-10 mb-6"
                  onClick={() => setDropbox1(!dropbox1)}
                >
                  <strong>
                    (필수) 개인정보수집 및 이용 등에 대한 동의에 대한 내용
                  </strong>
                  <img
                    src={`/image/chevron-${dropbox1 ? "up" : "down"}.svg`}
                    width={20}
                    className="mr-3"
                  />
                </h3>

                {dropbox1 && (
                  <div className="document mt-2">
                    <dl className="bg_gray">
                      <dt className="apt_construction"></dt>
                      <dd>
                        [이하 "회사"라 함]는 개인정보보호법, 정보통신망 이용촉진
                        및 정보보호 등에 관한 법률 등 관련 법령상의 개인정보보호
                        규정을 준수하며, 홈페이지 이용자들의 개인정보 보호에
                        최선을 다하고 있습니다.
                      </dd>
                    </dl>
                    <dl>
                      <dt>1. 개인정보의 수집 및 이용 목적</dt>
                      <dd>
                        <strong>
                          '
                          <span className="apt_title">이천 부발역 에피트 </span>
                          '의 분양정보제공 및 분양상담의 목적을 위해 활용합니다.
                        </strong>
                      </dd>
                    </dl>
                    <dl>
                      <dt>2. 수집하는 개인정보 항목</dt>
                      <dd>
                        <strong>수집정보 항목</strong> : 이름, 연락처
                      </dd>
                    </dl>
                    <dl>
                      <dt>3. 개인정보의 보유 및 이용기간</dt>
                      <dd>
                        회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된
                        후에는 해당 정보를 지체없이 파기합니다. 단, 관계법령의
                        규정에 의하여 보존할 필요가 있는 경우 아래와 같이
                        관계법령에서 정한 일정 기간 동안 개인정보를 보관할 수
                        있습니다. 이 경우 별도의 데이터베이스(DB)로 옮기거나
                        보관장소를 달리하여 보존합니다.
                        <ul>
                          <li>
                            - 고객센터 문의하기 이용고객 : 상담 완료 후 1년
                          </li>
                          <li>
                            - 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년
                          </li>
                          <li>
                            &nbsp;&nbsp;&nbsp;보존 이유: 전자상거래등에서의
                            소비자보호에 관한 법률
                          </li>
                        </ul>
                      </dd>
                    </dl>
                    <dl>
                      <dt>4. 동의를 거부할 권리 및 동의 거부에 따른 불이익</dt>

                      <dd>
                        이용자는 개인정보 수집 및 이용에 대해 동의하지 않을
                        권리가 있습니다. 다만, 고객센터를 통해 제공받는 정보는
                        문의사항을 처리하기에 필수적인 항목으로 해당 정보를
                        제공받지 못할 경우 정상적인 답변을 제공할 수 없습니다.
                      </dd>
                    </dl>
                  </div>
                )}
              </div>
            </div>
            <div className="privacy clear">
              <div className="flex justify-between sm:mx-10">
                <h3>(선택) 마케팅정보수집 및 이용 등에 대한 동의</h3>
                <span className="">
                  <input
                    name="agree_mkt"
                    type="checkbox"
                    id="agree_mkt_y"
                    checked={agreement2}
                    onChange={handleAgreementChange2}
                  />
                  <label htmlFor="agree_mkt_y"></label>
                </span>
              </div>
              <h3
                className="flex justify-between items-center text-[15px] sm:mx-10 mb-6"
                onClick={() => setDropbox2(!dropbox2)}
              >
                <strong>
                  (선택) 마케팅정보수집 및 이용 등에 대한 동의에 대한 내용
                </strong>
                <img
                  src={`/image/chevron-${dropbox2 ? "up" : "down"}.svg`}
                  width={20}
                  className="mr-3"
                />
              </h3>
              {dropbox2 && (
                <div className="document">
                  <dl className="bg_gray">
                    <dt className="apt_construction"></dt>
                    <dd>
                      [이하 "회사"라 함]는 개인정보보호법, 정보통신망 이용촉진
                      및 정보보호 등에 관한 법률 등 관련 법령상의 개인정보보호
                      규정을 준수하며, 홈페이지 이용자들의 개인정보 보호에
                      최선을 다하고 있습니다.
                    </dd>
                  </dl>
                  <dl>
                    <dt>1. 마케팅정보의 수집 및 이용 목적</dt>
                    <dd>
                      <strong>
                        '<span className="apt_title">이천 부발역 에피트 </span>
                        '의 분양정보제공 및 분양상담의 목적을 위해 활용합니다.
                      </strong>
                    </dd>
                  </dl>
                  <dl>
                    <dt>2. 수집하는 항목</dt>
                    <dd>
                      <strong>수집정보 항목</strong> : 이름, 연락처
                    </dd>
                  </dl>
                  <dl>
                    <dt>3. 마케팅정보의 보유 및 이용기간</dt>
                    <dd>
                      회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된
                      후에는 해당 정보를 지체없이 파기합니다. 단, 관계법령의
                      규정에 의하여 보존할 필요가 있는 경우 아래와 같이
                      관계법령에서 정한 일정 기간 동안 개인정보를 보관할 수
                      있습니다. 이 경우 별도의 데이터베이스(DB)로 옮기거나
                      보관장소를 달리하여 보존합니다.
                      <ul>
                        <li>- 고객센터 문의하기 이용고객 : 상담 완료 후 1년</li>
                        <li>- 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년</li>
                        <li>
                          &nbsp;&nbsp;보존 이유: 전자상거래등에서의 소비자보호에
                          관한 법률
                        </li>
                      </ul>
                    </dd>
                  </dl>
                  <dl>
                    <dt>4. 동의를 거부할 권리 및 동의 거부에 따른 불이익</dt>
                    <dd>
                      이용자는 개인정보 수집 및 이용에 대해 동의하지 않을 권리가
                      있습니다. 다만, 이벤트 및 마케팅에 대한 정보는
                      문의사항등을 처리하기에 필수적인 항목으로 해당 정보를
                      제공받지 못할 경우 정상적인 답변을 제공할 수 없습니다.
                    </dd>
                  </dl>
                </div>
              )}
            </div>

            <div className="submit_btn mr-7 sm:mr-0 mb-[-20px]">
              <input
                type="button"
                className="submit_btn1"
                value="등록하기"
                onClick={handleSubmit}
                disabled={pending}
              />
            </div>
          </form>
        </main>

        <footer className="bg-white">
          <footer className="main_footer">
            <div className="inner">
              <div className="footer_section01">
                <ul className="w-[320px]"></ul>
              </div>

              <div className="footer_section02">
                <ul className="w-[320px]"></ul>
              </div>
            </div>
          </footer>
        </footer>
      </div>
    </body>
  );
};

export default Page;
