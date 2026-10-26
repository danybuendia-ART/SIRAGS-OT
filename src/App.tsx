/*import LoginView from "./view/login/login";

function App() {
  return <LoginView />;
}

export default App;*/
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginView from "./view/login/login";
import HomeView from "./view/home/home";
import ProtectedRoute from "./utils/ProtectedRoute";
import Header from "./components/header/header";
import Proyects from "./view/proyectos/proyectos";
import PorcentajeActividades from "./view/procentaje-actividades/porcentaje-actividades";
import PorcentajeProyectos from "./view/porcentaje-proyectos/porcentaje-proyectos";
function App() {
  const user = localStorage.getItem("user");

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/home" replace /> : <LoginView />
          }
        />

        {/* Ruta protegida */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Header />
              <HomeView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/porcentaje-actividades"
          element={
            <ProtectedRoute>
              <Header />
              <PorcentajeActividades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos"
          element={
            <ProtectedRoute>
              <Header />
              <Proyects />
            </ProtectedRoute>
          }
        />
          <Route
          path="/avance-porcentual"
          element={
            <ProtectedRoute>
              <Header />
              <PorcentajeProyectos />
            </ProtectedRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;