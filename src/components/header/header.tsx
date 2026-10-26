import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logosir.png"
import { LogIn, Ticket, MoveLeft } from "lucide-react";//logo de inicio de sesion

import { getCurrentUser } from "../../utils/auth";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getCurrentUser();

    const isActive = (to: string) => {
        if (to === "/") return location.pathname === "/";
        return location.pathname.startsWith(to);
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
            <div className="container-fluid">

                {/* Logo */}
                <button
                    className="btn p-0 border-0 d-flex align-items-center gap-3"
                    onClick={() => navigate("/")}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ height: "40px" }}
                    />

                    <div className="text-start d-none d-md-block">
                        <div className="fw-semibold">
                            Sistema Mantenimiento OT SIRAGS
                        </div>
                        <small className="text-secondary">
                            Bienvenido {user[0]?.nombre}
                        </small>
                    </div>
                </button>

                {/* Botón móvil */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mobileMenu"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Menú escritorio */}
                <div className="collapse navbar-collapse justify-content-center d-none d-lg-flex">
                    <ul className="navbar-nav">

                        <li className="nav-item" key={"/home"}>
                            <button
                                className={`btn mx-1 ${isActive("/home") ? "btn-primary" : "btn-light"}`}
                                onClick={() => navigate("/home")}>
                                Actividades
                            </button>
                        </li>
                        <li className="nav-item" key={"/porcentaje-actividades"}>
                            <button
                                className={`btn mx-1 ${isActive("/porcentaje-actividades") ? "btn-primary" : "btn-light"}`}
                                onClick={() => navigate("/porcentaje-actividades")}>
                                Porcentaje Actividades
                            </button>
                        </li>
                        <li className="nav-item" key={"/proyectos"}>
                            <button
                                className={`btn mx-1 ${isActive("/proyectos") ? "btn-primary" : "btn-light"}`}
                                onClick={() => navigate("/proyectos")}>
                                Proyectos
                            </button>
                        </li>
                        <li className="nav-item" key={"/avance-porcentual"}>
                            <button
                                className={`btn mx-1 ${isActive("/avance-porcentual") ? "btn-primary" : "btn-light"}`}
                                onClick={() => navigate("/avance-porcentual")}>
                                Avance Porcentual
                            </button>
                        </li>

                        {/*NAV_LINKS.map((item) => (
                            <li className="nav-item" key={item.to}>
                                <button
                                    className={`btn mx-1 ${isActive(item.to)
                                        ? "btn-primary"
                                        : "btn-light"
                                        }`}
                                    onClick={() => navigate(item.to)}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))*/}

                    </ul>
                </div>
            </div>
        </nav>
    );
}