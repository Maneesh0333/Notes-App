import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, User, Settings, Menu, X } from "lucide-react";
import { useAuth } from "@/auth/authContext";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import apiAxios from "@/api/apiAxios";

function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async (token) => {
      const res = await apiAxios.post(
        "/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      logout();
      toast.success(data?.message || "Logged out successfully!");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message);
    },
  });

  const handleLogout = () => logoutMutation.mutate(user?.accessToken);

  return (
    <nav className="flex items-center justify-between px-20 py-3 bg-white select-none shadow max-lg:px-10 max-md:px-5">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <BookOpen className="text-green-600" />
        <h3 className="text-xl font-bold text-green-600">
          Notes <span className="text-gray-800">App</span>
        </h3>
      </div>

      {/* Desktop Menu */}
      <div className="flex items-center gap-5 font-semibold relative max-md:hidden">
        <Link to="/" className="hover:text-green-600">
          Home
        </Link>
        <Link to="/features" className="hover:text-green-600">
          Features
        </Link>
        <Link to="/about" className="hover:text-green-600">
          About
        </Link>

        {!user ? (
          <Link to="/login" className="text-green-600 hover:underline">
            Log in
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <div
              className="h-10 w-10 bg-green-600 rounded-full cursor-pointer flex items-center justify-center text-white font-semibold select-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {user.user.username ? user.user.username[0].toUpperCase() : "U"}
            </div>

            {isOpen && (
              <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md flex flex-col p-3 w-40 z-50">
                <Link
                  to="/profile"
                  className="hover:bg-gray-100 px-3 py-2 rounded-md flex gap-2 text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <User /> Profile
                </Link>
                <Link
                  to="/settings"
                  className="hover:bg-gray-100 px-3 py-2 rounded-md flex gap-2 text-green-600"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-md text-red-500 flex gap-2"
                >
                  <LogOut /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="hidden max-md:flex items-center justify-center p-2 text-green-600"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-center gap-4 py-5 z-50 max-md:flex">
          <Link
            to="/"
            className="hover:text-green-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/features"
            className="hover:text-green-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>

          <Link
            to="/about"
            className="hover:text-green-600"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>

          {!user ? (
            <Link
              to="/login"
              className="text-green-600 hover:underline"
              onClick={() => setIsMenuOpen(false)}
            >
              Log in
            </Link>
          ) : (
            <>
              <Link
                to="/profile"
                className="hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
