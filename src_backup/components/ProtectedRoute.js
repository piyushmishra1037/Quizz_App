import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        dispatch(ShowLoading());
        const response = await getUserInfo();
        dispatch(HideLoading());
        if (response.success) {
          dispatch(SetUser(response.data));
        } else {
          message.error(response.message);
          navigate("/login");
        }
      } catch (error) {
        dispatch(HideLoading());
        message.error(error.message);
        navigate("/login");
      }
    };

    fetchUser();
  }, [token]);

  const userMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/user/reports"),
    },
  ];

  const adminMenu = [
    {
      title: "Exams",
      paths: ["/admin/exams", "/admin/exams/add", "/admin/exams/edit/:examId"],
      icon: <i className="ri-book-line"></i>,
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "Reports",
      paths: ["/admin/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/admin/reports"),
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row h-16 bg-white shadow-md">
        <div className="flex items-center justify-center w-16">
          <i className="ri-menu-line text-xl cursor-pointer" onClick={() => setCollapsed(!collapsed)}></i>
        </div>
        <div className="flex items-center justify-between flex-1 px-4">
          <h1 className="text-xl font-bold">Quiz App</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <i className="ri-user-line"></i>
              <span>{user?.name}</span>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`bg-gray-100 w-64 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-home-line"></i>
              <span className={`${collapsed ? "hidden" : "block"}`}>Dashboard</span>
            </div>
            <div className="space-y-2">
              {user?.role === "user" ? (
                userMenu.map((item) => (
                  <div
                    key={item.title}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-200 ${
                      item.paths.includes(window.location.pathname) ? "bg-gray-200" : ""
                    }`}
                    onClick={item.onClick}
                  >
                    {item.icon}
                    <span className={`${collapsed ? "hidden" : "block"}`}>{item.title}</span>
                  </div>
                ))
              ) : (
                adminMenu.map((item) => (
                  <div
                    key={item.title}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-200 ${
                      item.paths.includes(window.location.pathname) ? "bg-gray-200" : ""
                    }`}
                    onClick={item.onClick}
                  >
                    {item.icon}
                    <span className={`${collapsed ? "hidden" : "block"}`}>{item.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
