import React, { useState } from "react";
import { LogIn, Ticket, MoveLeft } from "lucide-react";//logo de inicio de sesion
import "./login.css"
import { apiRequest } from "../../utils/api";
import { alertSuccess, alertError, alertWarning } from "../../utils/alerts";
import { useNavigate } from "react-router-dom";

export default function LoginView() {
  //variables para login
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  //variables para registro
  const [addName, setName] = useState("");
  const [addMail, setMail] = useState("");
  const [addPass, setPass] = useState("");
  const [showRegister, setRegister] = useState(false);

  //variables para enviar un ticket
  const [showTicket, setTicket] = useState(false);
  const [addSolicitante, setSolicitante] = useState("");
  const [addComment, setComment] = useState("");

  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    accessSystem(correo, password);
  };

  async function accessSystem(mail: string, pass: string) {
    const info = {
      action: "login",
      correo: mail,
      pass
    }
    const response = await apiRequest("usuarios", info, "POST");
    if (response.warn) {
      alertError(response.warn)
      return;
    }
    localStorage.setItem("user", JSON.stringify(response));
    alertSuccess(`Bienvenido ${response[0]?.nombre}`)
    navigate("/home");

  }
  const showCreate = () => {
    setRegister(!showRegister);
  };
  const changeView = () => {
    setTicket(true);
  }
  const showview = () => {
    setTicket(false);

  }
  const addAcount = async (e: React.FormEvent) => {
    e.preventDefault();
    const info = {
      action: "create",
      nombre: addName,
      correo: addMail,
      pass: addPass
    }
    const response = await apiRequest("usuarios", info, "POST");
    if (response.warn) {

      return alertWarning(response.warn);
    }

    alertSuccess(response.message);
    accessSystem(addMail, addPass);

  }
  const sendTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await apiRequest("tickets", {action: "create", nombre: addSolicitante, descripcion: addComment}, "POST")

    if(response.message){
      alertSuccess(response.message)
    }
  }
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center fondo">
      <div
        className="card shadow"
      >
        <div className={`card-body ${showTicket ? "hidden" : " show"}`}>
          <div className="text-center circle">
            <LogIn />
          </div>
          <div className="text-center">
            <h3>Iniciar Sesion</h3>
            <p>Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Correo
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="cooreo@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100"
            >
              Iniciar sesión
            </button>
          </form>
          <div className="create-acount p-3">
            <p>¿No tienes un usuario? crea tu cuenta aqui </p>
            <div className="d-flex space-x-3">
              <button
                type="button"
                className="btn btn-light"
                onClick={showCreate}
              >
                {showRegister ? "Ocultar registro" : "Crear cuenta"}
              </button>
              <button type="button" onClick={changeView} className="btn btn-dark">Agregar ticket </button>
            </div>
            <div className={`space-x-3 p-3 ${showRegister ? "show" : "hidden"}`} >
              <form onSubmit={addAcount}>
                <div className="mb-3">
                  <label className="form-label">Nombre del usuario</label>
                  <input
                    type="text"
                    className="form-control "
                    placeholder="Agrega tu nombre"
                    value={addName}
                    onChange={(e) => setName(e.target.value)}

                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input type="email"
                    className="form-control"
                    placeholder="Agrega un correo"
                    value={addMail}
                    onChange={(e) => setMail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input type="password"
                    className="form-control"
                    placeholder="******"
                    value={addPass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>
                <button className="btn btn-dark w-100">Registrar</button>

              </form>
            </div>
          </div>
        </div>
        <div className={`card-show ${showTicket ? "show" : "hidden"}`}>
          <div className="card-body">
            <div className="btn btn-dark" style={{ color: "white" }} onClick={showview}>
              <MoveLeft />
            </div>
            <div className="text-center circle">
              <Ticket />
            </div>
            <div className="text-center">
              Agregar Ticket
            </div>
            <form onSubmit={sendTicket}>
              <div className="mb-3">
                <label className="form-label">Nombre de usuario</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingresa tu nombre"
                  required
                  value={addSolicitante}
                  onChange={(e) => setSolicitante(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Comentario</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingresa tu comentario"
                  required
                  value={addComment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <button className=" w-100 btn btn-dark">Enviar ticket</button>
            </form>
          </div>
        </div>
      </div>

    </div>

  );
}