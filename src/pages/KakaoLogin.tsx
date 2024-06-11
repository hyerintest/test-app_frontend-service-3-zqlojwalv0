import React from "react";
import { useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from "../stores/account/action";

const KakaoLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const code = useMemo(
    () => new URL(window.location.href).searchParams.get("code"),
    []
  );

  const kakaoLogin = useCallback(async () => {
    const payload = {
      code: code,
      redirectUrl: `${window.location.origin}/oauth/kakao`,
    };
    try {
      const res = await axios.post(
        `${window.location.origin}${process.env.REACT_APP_AUTH_SERVICE}/oauth2/kakao`,
        payload
      );

      const { success, result } = res.data;
      if (success) {
        const { id } = result;
        dispatch(
          signIn({
            saveAuth: true,
            authToken: "test-token",
            username: id,
            email: "",
          })
        );

        navigate("/main");
      }
    } catch (e) {
      console.log(e);
    }
  }, [code, dispatch, navigate]);

  useEffect(() => {
    kakaoLogin();
  }, []);

  return <></>;
};

export default KakaoLogin;
