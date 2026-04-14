import DefaultLayout from "./components/layout/DefaultLayout";
import SideMenuLayout from "./components/layout/SideMenuLayout";
import MainPage from "./pages/mainPage/MainPage";
import TutorialPage from "./pages/tutorialPage/TutorialPage";
import GuidePage from "./pages/guidePage/GuidePage";
import CalendarPage from "./pages/calendarPage/CalendarPage";
import CctvPage from "./pages/cctvPage/CctvPage";
import CctvEditPage from "./pages/cctvPage/CctvEditPage";
import MyPage from "./pages/myPage/MyPage";
import UserConfirmPage from "./pages/myPage/UserConfirmPage";
import UserEditPage from "./pages/myPage/UserEditPage";
import LoginPage from "./pages/authPage/LoginPage";
import RegisterPage from "./pages/authPage/RegisterPage";
import FindPasswordPage from "./pages/authPage/FindPasswordPage";
import ResetPasswordPage from "./pages/authPage/ResetPasswordPage";
import { UserProvider } from "./stores/UserContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },

      {
        path: "/find-password",
        element: <FindPasswordPage />,
      },

      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    element: <SideMenuLayout />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/tutorial", element: <TutorialPage /> },
      { path: "/calendar", element: <CalendarPage /> },
      { path: "/cctv", element: <CctvPage /> },
      { path: "/cctv/edit", element: <CctvEditPage /> },
      { path: "/cctv/add", element: <CctvEditPage /> },
      { path: "/guide", element: <GuidePage /> },
      { path: "/mypage", element: <MyPage /> },
      { path: "/mypage/edit", element: <UserEditPage /> },
      { path: "/mypage/withdraw", element: <UserConfirmPage /> },
    ],
  },
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        limit={3}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </UserProvider>
  );
}

export default App;
