import { Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import MainPage from "../pages/MainPage";

const path = "";

const routes = (isSignIn: boolean) => {
  return [
    {
      path: `${path}`,
      element: isSignIn ? (
        <Navigate to={`${path}/main`} replace />
      ) : (
        <Navigate to={`${path}/login`} replace />
      ),
    },
    {
      path: `${path}/main`,
      element: isSignIn ? (
        <MainLayout />
      ) : (
        <Navigate to={`${path}/login`} replace />
      ),
      children: [{ path: "", element: <MainPage /> }],
    },
    {
      path: `${path}/login`,
      element: isSignIn ? <Navigate to={`${path}/main`} /> : <LoginPage />,
    },
    {
      path: "/404",
      element: <NotFound />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ];
};

export default routes;
