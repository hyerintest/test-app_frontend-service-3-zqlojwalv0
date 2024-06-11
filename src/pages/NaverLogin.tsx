import React from "react";
import { useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from "../stores/account/action";

const NaverLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const code = useMemo(
    () => new URL(window.location.href).searchParams.get("code"),
    []
  );
  const state = useMemo(
    () => new URL(window.location.href).searchParams.get("state"),
    []
  );

  const naverLogin = useCallback(async () => {
    const payload = {
      code,
      state,
    };
    try {
      const res = await axios.post(
        `${window.location.origin}${process.env.REACT_APP_AUTH_SERVICE}/oauth2/naver`,
        payload
      );

      const { success, result } = res.data;
      if (success) {
        const { email, name, id } = result;
        dispatch(
          signIn({
            saveAuth: true,
            authToken: id,
            username: name,
            email: email,
          })
        );

        navigate("/main");
      }
    } catch (e) {
      console.log(e);
    }
  }, [code, dispatch, navigate, state]);

  useEffect(() => {
    naverLogin();
  }, []);

  return <></>;
};

export default NaverLogin;
