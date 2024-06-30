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
        <div className="day_tags">30-06-2024</div>
        <div className="genchat__nav--child">
          <p>
            Heineken analyst 
          </p>
          <i class="fas fa-ellipsis-h" onClick={toggleDialog}></i>
          <div
            className="dialog_func"
            style={{ display: dialogVisible ? "block" : "none" }}
          >
            <Dialognavfunc toggleDialog={toggleDialog} />
          </div>
        </div>
      </div>
    </div>
  );
}
