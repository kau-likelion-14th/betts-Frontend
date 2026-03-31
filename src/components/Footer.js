import "../styles/Footer.css";
import ltelogo from "../assets/image/logo.png";
import { NavLink } from "react-router-dom";

function Footer() {
    return(
        <div className="footer">
            <div className="footer-top">
                <img src={ltelogo} alt="LTE 로고" className="footer-logo"/>
                <span className="footer-title">Lion To-do Everyday</span>
            </div>

            <div className="footer-middle">
                LTE는 멋쟁이사자처럼에서 개발한 투두 관리 기반의 웹 서비스입니다.
            </div>

            <div className="footer-bottom-container">
                <div className="info-item-container">
                    <div className="info-item-row">
                        <span className="label">상호명</span>
                        <span className="value">멋쟁이사자처럼</span>

                        <span className="label">대표자</span>
                        <span className="value">전유안</span>

                        <span className="label">주소</span>
                        <span className="value">경기도 고양시 항공대학로79 항공우주센터 3층 창업카페</span>
                    </div>

                    <div className="info-item-row">
                        <span className="label">사업자 등록번호</span>
                        <span className="value">111-22-33333</span>

                        <span className="label">개인정보보호책임자</span>
                        <span className="value">전유안</span>
                        
                        <span className="label">이메일</span>
                        <span className="value">ms4803gs@gmail.com</span>

                        <span className="label">전화번호</span>
                        <span className="value">010-7601-1664</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;