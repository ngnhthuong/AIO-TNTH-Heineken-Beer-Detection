import longLogo from "../images/longlogo.png";
import textLogo from "../images/text-logo.png";
import "../css/Gennav.css";
export default function Gennav() {
  return (
    <>
      <div className="main__left--logo">
        <img className="logo" src={longLogo} alt="" />
      </div>
      <div className="main__left--funcs">
        <div className="main__left--func">
          <div className="main__left--func--item head">
            <i class="fab fa-rocketchat"></i> <span>Chatbox</span>
          </div>
          <div className="main__left--func--item tail">
            <i class="fas fa-cog"></i> <span>Setting</span>
          </div>
        </div>
        <div className="main__left--functails">
          <div className="main__left--func--itemtails">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </>
  );
}
