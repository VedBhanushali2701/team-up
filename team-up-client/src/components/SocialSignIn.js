import React, { useContext } from "react";
import { doSocialSignIn } from "../firebase/FirebaseFunctions";
import axios from "axios";
import firebase from "firebase/compat/app";
import Cookies from "js-cookie";
import { AuthContext } from "../firebase/Auth";
import { useNavigate } from "react-router-dom";

const SocialSignIn = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const socialSignOn = async (provider) => {
    try {
      await doSocialSignIn(provider);
      let idToken = await firebase.auth().currentUser.getIdToken();
      try {
        let { data } = await axios.post(
          "http://localhost:4000/users/login",
          null,
          {
            headers: {
              // "Content-Type": "application/json",
              Authorization: "Bearer " + idToken,
              // "Accept":"application/json"
            },
          }
        );
        if (data) {
          Cookies.set("user", data._id);
          navigate("/workspaces");
        }
      } catch (e) {
        console.log(e);
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <img
        onClick={() => socialSignOn("google")}
        alt="google signin"
        src="/imgs/btn_google_signin.png"
      />
      <img
        onClick={() => socialSignOn("facebook")}
        alt="facebook signin"
        src="/imgs/facebook_signin.png"
      />
    </div>
  );
};

export default SocialSignIn;
