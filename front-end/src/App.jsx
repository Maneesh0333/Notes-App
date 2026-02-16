import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyEmail from "./pages/VerifyEmail";
import Verify from "./pages/Verify";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import About from "./pages/About";
import ForgetPassword from "./pages/ForgetPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ChangePassword from "./pages/ChangePassword";
import Features from "./pages/Features";
import NotesApp from "./pages/NotesApp";
import CreateNote from "./pages/CreateNote";
import { useAuthStore } from "./auth/authStore";
import { useEffect } from "react";
import apiAxios from "./api/apiAxios";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/features",
        element: <Features />,
      },
      {
        path: "/create-notes",
        element: (
          <ProtectedRoute>
            <CreateNote />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notes/:id",
        element: (
          <ProtectedRoute>
            <NotesApp />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/verify",
    element: <VerifyEmail />,
  },
  {
    path: "/verify/:token",
    element: <Verify />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/verify-otp/:email",
    element: <VerifyOTP />,
  },
  {
    path: "/change-password/:resetToken",
    element: <ChangePassword />,
  },
]);

function App() {
  const { setUser, setAccessToken, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);

        await useAuthStore.getState().fetchCsrfToken();

        const refreshRes = await apiAxios.post("/auth/refresh-token");
        setAccessToken(refreshRes.data.accessToken);

        const userRes = await apiAxios.get("/auth/me");
        setUser(userRes.data.user);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        closeButton={false}
        autoClose={3000}
      />

      <RouterProvider router={router} />
    </div>
  );
}

export default App;
