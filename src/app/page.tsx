"use client";
import React, {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  IAuthenticateMsg,
  ICertifyButton,
  IReserveMsg,
  IrequestSnsMsg,
} from "@/types";
import { authenticate, requestCertify, reserveUser } from "./action";

import "../styles/reset.css";
import "../styles/style.css";
import "../styles/ha_newStyle.css";
import "../styles/style_edit.css";
import "../styles/swiper-bundle.min.css";
import "../styles/sub.css";
import "../styles/interest.css";
import "../styles/addition.css";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const Page = () => {
  const router = useRouter();

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

  const [time, setTime] = useState(360); // 6분 = 360초

  const [isPop, setIsPop] = useState(false);

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
    const msg: IrequestSnsMsg = await requestCertify(phoneNumber);
    if (msg === IrequestSnsMsg.SUCCESS) {
      setCertifyButton(ICertifyButton.AUTH);
      alert(msg);
      return;
    }

    alert(msg);
  };

  const requestAuthenticate = async () => {
    const msg: IAuthenticateMsg = await authenticate(
      phoneNumber,
      certifiNumber
    );
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
    setAgreement1(event.target.value === "true");
  };

  const handleAgreementChange2: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setAgreement2(event.target.value === "true");
  };

  const handleSubmit: MouseEventHandler<HTMLInputElement> = async (e) => {
    if (certifyButton !== ICertifyButton.COMPLETE)
      return alert("휴대폰 인증을 먼저 진행해야 합니다.");
    if (!agreement1)
      return alert("(필수) 개인정보 수집 및 이용 등에 동의하셔야 합니다.");
    const response = await reserveUser({
      name,
      phoneNumber,
      agreement1,
      agreement2,
    });
    if (response === IReserveMsg.SUCCESS) {
      alert("등록이 완료되었습니다!");
      return window.location.reload();
    }

    alert(response);
  };

  useEffect(() => {
    // 페이지가 로드될 때마다 맨 위로 스크롤
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
    <body className="sub interest">
      <header className="layout">
        <div className="header_default">
          <h1 className="header_default_logo">
            <a href="/">
              <img
                src="/image/common/new_logo_black.png"
                data-white="/image/common/new_logo_white.png"
                data-black="/image/common/new_logo_black.png"
              />
            </a>
          </h1>
        </div>
      </header>
      <div className="visual user">
        <h1 className="visual_title">관심고객등록</h1>
      </div>

      <main className="layout">
        <div className="content_head">
          <span>안심하세요!</span>
          <p>
            관심고객으로 등록된 고객님의 정보는 분양정보를 안내하는데
            사용합니다.
          </p>
        </div>

        <form name="interest">
          <div className="table_wrap">
            <table className="table private data">
              <colgroup>
                <col width="15%" />
                <col width="*" />
              </colgroup>
              <tbody>
                <tr>
                  <td className="heading">성명</td>
                  <td>
                    <p>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input_txt input_txt1 input_txt_first"
                      />
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="heading">연락처</td>
                  <td>
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
                        disabled={certifyButton === ICertifyButton.COMPLETE}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="privacy_wrap clear">
            <div className="chk_all">
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

            <div className="privacy clear">
              <h3>(필수) 개인정보수집 및 이용 등에 대한 동의</h3>
              <div className="document">
                <dl className="bg_gray">
                  <dt className="apt_construction"></dt>
                  <dd>
                    [이하 "회사"라 함]는 개인정보보호법, 정보통신망 이용촉진 및
                    정보보호 등에 관한 법률 등 관련 법령상의 개인정보보호 규정을
                    준수하며, 홈페이지 이용자들의 개인정보 보호에 최선을 다하고
                    있습니다.
                  </dd>
                </dl>
                <dl>
                  <dt>1. 개인정보의 수집 및 이용 목적</dt>
                  <dd>
                    <strong>
                      '<span className="apt_title">이천 부발역 에피트 </span>'의
                      분양정보제공 및 분양상담의 목적을 위해 활용합니다.
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
                    회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는
                    해당 정보를 지체없이 파기합니다. 단, 관계법령의 규정에
                    의하여 보존할 필요가 있는 경우 아래와 같이 관계법령에서 정한
                    일정 기간 동안 개인정보를 보관할 수 있습니다. 이 경우 별도의
                    데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
                    <ul>
                      <li>- 고객센터 문의하기 이용고객 : 상담 완료 후 1년</li>
                      <li>- 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년</li>
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
                    이용자는 개인정보 수집 및 이용에 대해 동의하지 않을 권리가
                    있습니다. 다만, 고객센터를 통해 제공받는 정보는 문의사항을
                    처리하기에 필수적인 항목으로 해당 정보를 제공받지 못할 경우
                    정상적인 답변을 제공할 수 없습니다.
                  </dd>
                </dl>
              </div>
              <div className="agree_btn">
                <span>
                  <input
                    name="agree_prv"
                    type="radio"
                    id="agree_prv_y"
                    value="true"
                    checked={agreement1}
                    onChange={handleAgreementChange1}
                  />
                  <label htmlFor="agree_prv_y">동의</label>
                </span>
                <span>
                  <input
                    name="agree_prv"
                    type="radio"
                    id="agree_prv_n"
                    value="false"
                    checked={!agreement1}
                    onChange={handleAgreementChange1}
                  />
                  <label htmlFor="agree_prv_n">미동의</label>
                </span>
              </div>
            </div>
          </div>
          <div className="privacy clear">
            <h3>(선택) 마케팅정보수집 및 이용 등에 대한 동의</h3>
            <div className="document">
              <dl className="bg_gray">
                <dt className="apt_construction"></dt>
                <dd>
                  [이하 "회사"라 함]는 개인정보보호법, 정보통신망 이용촉진 및
                  정보보호 등에 관한 법률 등 관련 법령상의 개인정보보호 규정을
                  준수하며, 홈페이지 이용자들의 개인정보 보호에 최선을 다하고
                  있습니다.
                </dd>
              </dl>
              <dl>
                <dt>1. 마케팅정보의 수집 및 이용 목적</dt>
                <dd>
                  <strong>
                    '<span className="apt_title">이천 부발역 에피트 </span>'의
                    분양정보제공 및 분양상담의 목적을 위해 활용합니다.
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
                  회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는
                  해당 정보를 지체없이 파기합니다. 단, 관계법령의 규정에 의하여
                  보존할 필요가 있는 경우 아래와 같이 관계법령에서 정한 일정
                  기간 동안 개인정보를 보관할 수 있습니다. 이 경우 별도의
                  데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
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
                  있습니다. 다만, 이벤트 및 마케팅에 대한 정보는 문의사항등을
                  처리하기에 필수적인 항목으로 해당 정보를 제공받지 못할 경우
                  정상적인 답변을 제공할 수 없습니다.
                </dd>
              </dl>
            </div>
            <div className="agree_btn">
              <span>
                <input
                  name="agree_mkt"
                  type="radio"
                  id="agree_mkt_y"
                  value="true"
                  checked={agreement2}
                  onChange={handleAgreementChange2}
                />
                <label htmlFor="agree_mkt_y">동의</label>
              </span>
              <span>
                <input
                  name="agree_mkt"
                  type="radio"
                  id="agree_mkt_n"
                  value="false"
                  checked={!agreement2}
                  onChange={handleAgreementChange2}
                />
                <label htmlFor="agree_mkt_n">미동의</label>
              </span>
            </div>
          </div>

          <div className="submit_btn clear">
            <input
              type="button"
              className="submit_btn1"
              value="등록하기"
              onClick={handleSubmit}
            />
            &nbsp;
            <input
              type="button"
              className="submit_btn2"
              value="취소하기"
              onClick={() => {
                window.location.reload();
              }}
            />
          </div>
        </form>
      </main>

      <footer className="layout">
        <footer className="main_footer">
          <div className="inner">
            <div className="main_topbtn">
              <a href="#">
                <img src="/image/common/top_btn.png" alt="" />
              </a>
            </div>
            <div className="footer_section01">
              <h1 className="item">
                <img src="/image/common/logo_footer_2022.png" />
              </h1>

              <ul className="adr item">
                <li>
                  <b>Add</b>
                  <a href="http://naver.me/FrK5Jjpc" target="_blank">
                    서울 송파구 올림픽로 289 (신천동)
                  </a>
                </li>
                <li>
                  <b>Tel</b>
                  <a href="tel:02-3434-5114">02-3434-5114 (대표)</a>
                </li>
                <li>
                  <b>Fax</b>02-3434-5522
                </li>
              </ul>
            </div>

            <div className="footer_section02 item">
              <ul>
                <li>
                  <a
                    href="https://www.instagram.com/halla.vivaldi/"
                    target="_blank"
                  >
                    <img src="/image/common/footer_sns_instagram.png" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://post.naver.com/my.nhn?memberNo=4490345"
                    target="_blank"
                  >
                    <img src="/image/common/footer_sns_post.png" />
                  </a>
                </li>
                <li>
                  <a href="https://blog.naver.com/halla_apt" target="_blank">
                    <img src="/image/common/footer_sns_blog.png" />
                  </a>
                </li>
                <li className="footer_family" onClick={() => setIsPop(!isPop)}>
                  Family Site
                  <div
                    className="footer_family_down"
                    style={{ display: isPop ? "block" : "none" }}
                  >
                    <a href="https://www.halla.com" target="_blank">
                      HL그룹
                    </a>

                    <a href="https://www.hldni.com" target="_blank">
                      HL D&amp;I Halla
                    </a>
                    <a href="https://brand.hldni.com" target="_blank">
                      브랜드 고객전용
                    </a>
                  </div>
                </li>
              </ul>
              {/* <div className="footer_copyright">
                <a href="/sub/views/user/privacy">개인정보처리방침</a>
                <a href="/sub/views/user/guidelines">이용약관</a>
                <a href="/sub/views/user/email-security">
                  이메일주소 무단수집거부
                </a>
              </div> */}
            </div>
          </div>
        </footer>
      </footer>
    </body>
  );
};

export default Page;
