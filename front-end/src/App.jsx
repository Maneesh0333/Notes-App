import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyEmail from "./pages/VerifyEmail";
import Verify from "./pages/Verify";
import { UserProvider } from "./auth/authContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import About from "./pages/About";
import ForgetPassword from "./pages/ForgetPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ChangePassword from "./pages/ChangePassword";
import Features from "./pages/Features";
import NotesApp from "./pages/NotesApp";
import CreateNote from "./pages/CreateNote";

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
        element: <NotesApp />,
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
    path: "/change-password/:email",
    element: <ChangePassword />,
  },
]);

function App() {
  return (
    <div>
      <ToastContainer
        position="bottom-right"
        closeButton={false}
        autoClose={3000}
      />
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </div>
  );
}

export default App;
