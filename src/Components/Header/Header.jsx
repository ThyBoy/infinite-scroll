import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, signInWithGoogle } from "../../firebase.utils";
import Button from "../button/button.component";
import UploadImg from "../UploadImg/UploadImg";
import "./Header.scss";

function Header(props) {
  const [isDropDown, setIsDropDown] = useState(false);

  return (
    <div className="header">
      <Link className="logo" to="/">
        <p className="logo-name">Images</p>
      </Link>
      {props.isSignedIn ? (
        <div className="options">
          <Link className="option" to="/delete">
            <Button inverted={true}>Delete</Button>
          </Link>
          <Button
            style={{ display: "flex", alignItems: "center" }}
            onClick={() => auth.signOut()}
            inverted={true}
          >
            <img
              style={{ height: "25px", width: "25px", padding: "0px 10px" }}
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt=""
            />
            <p style={{padding: "0px 10px" }}>Sign out</p>
          </Button>
          <div className="option">
            <Button 
            onClick={()=>{setIsDropDown(!isDropDown)}}
            inverted={true}>Upload</Button>
          </div>
          {isDropDown ? <UploadImg setIsDropDown={setIsDropDown} /> :null}
        </div>
      ) : (
        <div className="options">
          <Button
            style={{ display: "flex", alignItems: "center" }}
            onClick={signInWithGoogle}
            inverted={true}
          >
            <img
              style={{ height: "25px", width: "25px", padding: "0px 10px" }}
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt=""
            />
            <p style={{padding: "0px 10px" }}>Sign In</p>
          </Button>
        </div>
      )}
    </div>
  );
}

export default Header;
