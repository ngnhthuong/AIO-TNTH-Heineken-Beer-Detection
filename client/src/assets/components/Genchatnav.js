import "../css/Genchat.css";
import { useState } from "react";
import Dialognavfunc from "./Dialognavfunc";
export default function Genchatnav() {
  const [dialogVisible, setDialogVisible] = useState(false);

  const toggleDialog = () => {
    setDialogVisible(!dialogVisible);
  };

  return (
    <div className="genchat__nav--info">
      <div className="search">
        <input type="text" />
        <button>
          <i className="fas fa-search"></i>
        </button>
      </div>

      <div className="history__nav">
        <div className="day_tags">15-06-2024</div>
        <div className="genchat__nav--child">
          <p>
            HowHow to usse githuHow to usse githuHow to usse githuHow to usse
            githu to usse github
          </p>
          <i class="fas fa-ellipsis-h" onClick={toggleDialog}></i>
          <div
            className="dialog_func"
            style={{ display: dialogVisible ? "block" : "none" }}
          >
            <Dialognavfunc toggleDialog={toggleDialog} />
          </div>
        </div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="day_tags">14-06-2024</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">
          <p>HowHow to usse githuHow </p>
        </div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
        <div className="genchat__nav--child">How to usse github</div>
      </div>
    </div>
  );
}
