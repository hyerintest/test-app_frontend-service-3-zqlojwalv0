import React from "react";
import "./styles/App.scss";
import { useRoutes } from "react-router-dom";
import routes from "./routes/routes";
import { CircularProgress, Modal } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./stores";

const App: React.FC = (props: any) => {
  const isSignIn = useSelector(
    (state: RootState) => state.accountReducer.saveAuth
  );
  const show = useSelector((state: RootState) => state.progressReducer.show);

  const routing = useRoutes(routes(isSignIn));

  return (
    <>
      {routing}
      <Modal open={show}>
        <div className="ProgressBlock">
          <CircularProgress></CircularProgress>
        </div>
      </Modal>
    </>
  );
};

export default App;
