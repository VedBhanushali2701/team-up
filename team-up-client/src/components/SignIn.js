import React, { useContext, useState } from "react";
import SocialSignIn from "./SocialSignIn";
// import { Navigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../firebase/FirebaseFunctions";
import axios from "axios";
import firebase from "firebase/compat/app";
import Card from "react-bootstrap/Card";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }

    if (form.checkValidity() === true) {
      event.preventDefault();
      let { email, password } = event.target;
      try {
        await doSignInWithEmailAndPassword(email.value, password.value);
        let idToken = await firebase.auth().currentUser.getIdToken();
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
          console.log(data);
          Cookies.set("user", data._id);
          if (data) {
            navigate("/workspaces");
          }
        }
      } catch (error) {
        alert(error);
      }
    }
  };
  const [validated, setValidated] = useState(false);

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById("validationCustom01").value;
    if (email) {
      doPasswordReset(email);
      alert("Password reset email was sent");
    } else {
      alert(
        "Please enter an email address below before you click the forgot password link"
      );
    }
  };
  // if (currentUser) {
  //   return <Navigate to="/workspace" />;
  // }
  return (
    <div className="d-flex justify-content-center mt-4">
      <Card className="p-3">
        <Card.Title className="d-flex justify-content-center">
          SIGN IN
        </Card.Title>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleLogin}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationCustom01">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                />
                <Form.Control.Feedback type="invalid">
                  Enter valid Email
                </Form.Control.Feedback>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationCustom03">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Enter valid Password
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Form.Group className="mb-3">
              <a role={"button"} onClick={passwordReset}>
                Forgot Password?
              </a>
            </Form.Group>
            <Button type="submit">Sign In</Button>
          </Form>

          <br />
          <SocialSignIn />
        </Card.Body>
      </Card>
    </div>
  );
}

export default SignIn;
