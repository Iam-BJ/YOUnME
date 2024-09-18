import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer">
      <p>
        Made with{" "}
        <span className="red">
          <i className="far fa-heart"></i>
        </span>{" "}
        by{" "}
        <a href="https://github.com/Iam-BJ/YOUnME" className="name-us">
          Bala Kant
        </a>
      </p>
    </div>
  );
}

export default Footer;
