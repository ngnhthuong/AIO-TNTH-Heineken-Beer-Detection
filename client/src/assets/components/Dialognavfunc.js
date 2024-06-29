import React, { useState } from "react";
import "../css/Dialog.css";
export default function Dialognavfunc({toggleDialog}) {
  return (
    <div className="dialog__background">
        <div className="dialog__child">
            <div className="dialog__function--head">
                <div className="close__dialog--head" onClick={toggleDialog}>
                    <i class="fas fa-times"></i>
                </div>
            </div>
            <div className="dialog__function--childs"></div>
        </div>
    </div>
  );
}
