import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const user = localStorage.getItem("user");

  return user ? <>{children}</> : <Navigate to="/" replace />;
}