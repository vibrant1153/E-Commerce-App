import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) return <Navigate to="/login" replace />;
    if (userInfo.role !== "admin") return <Navigate to="/" replace />;

    return children;
}