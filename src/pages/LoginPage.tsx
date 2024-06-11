import axios from "axios";
import React, { createRef, useCallback} from "react";

import { useDispatch } from "react-redux";
import logo from "../logo.svg";
import { signIn } from "../stores/account/action";

import { hideProgress, showProgress } from "../stores/progress/action";
import "./LoginPage.scss";
import sha256 from "crypto-js/sha256";
import {Config} from "../config";

const LoginPage: React.FC = () => {


  const usernameRef: React.RefObject<any> = createRef();
  const passwordRef: React.RefObject<any> = createRef();

  const dispatch = useDispatch();
  const onClickLogin = useCallback(() => {
    const username = usernameRef.current.value;
    const password = sha256(passwordRef.current.value).toString();

    dispatch(showProgress());

    const url = `${window.location.origin}${Config.API_SUB_PATH}/login`;
    const payload = {
      id: username,
      password: password,
    };
    axios
      .post(url, payload)
      .then((res) => {
        const { success, result } = res.data;
        if (success) {
          const { id, sessionId } = result;
          console.log(id, sessionId);
          dispatch(
            signIn({
              authToken: sessionId,
              username: id,
              email: "",
              saveAuth: true,
            })
          );
        }
      })
      .catch((e) => console.log(e))
      .finally(() => dispatch(hideProgress()));
      dispatch(
        signIn({
          saveAuth: true
        })
      );
  }, [dispatch, passwordRef, usernameRef]);



  return (
    <div className="page">
      <div className="login-logo-wrapper">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
      <div className="login-input-wrapper">
        <input
          ref={usernameRef}
          className="login-input username"
          placeholder="ID"
        />
        <input
          ref={passwordRef}
          className="login-input password"
          placeholder="PASSWORD"
          type="password"
        />
        <div className="login-button" onClick={onClickLogin}>
          LOGIN
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
