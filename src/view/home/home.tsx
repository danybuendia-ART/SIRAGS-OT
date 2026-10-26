import { useState, useEffect, useCallback } from "react";
import { apiRequest, decryptData } from "../../utils/api";
import "./home.css";
import Calendario from "../../components/calendar/calendar";
export default function HomeView() {

    const [activities, setActivities] = useState([]);
    const [monthlyActivityCount, setMonthlyActivityCount] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(() =>
        new Date().toLocaleDateString("es-MX", { month: "long", year: "numeric" })
    );

    const handleMonthChange = useCallback((month: string, count: number) => {
        setSelectedMonth(month);
        setMonthlyActivityCount(count);
    }, []);

    useEffect(() => {
        getActivities();
    }, [])


    const getActivities = async () => {
        const response = decryptData(await apiRequest("activities", null, "GET"));
        setActivities(response);
        console.log(response);
    }
    return (
        <div className="m-3 row">
            <div className="col">
                <h3>Actividades Programadas</h3>
                <p>Programa actividades recurrentes o para un solo dia y consulta sus fechas en el calendario</p>
            </div>
            <div className="col text-center">
                <div className="btn btn-dark">Lista de actividades</div>
            </div>
            <div className="col text-center">
                <button className="btn btn-dark">Agregar Actividad</button>
            </div>
            <div className="row ">
                <div className=" col card w-100 m-3 total">
                    <div className="card-body">
                        <p className="card-subtitle fg-3">Actividades Activas</p>
                        <h4 className="card-title">{activities.length}</h4>
                    </div>
                </div>
                <div className="col card w-100 m-3" >
                    <div className="card-body">
                        <p className="card-subtitle fg-3">Actividades de {selectedMonth}</p>
                        <h4 className="card-title">{monthlyActivityCount}</h4>
                    </div>
                </div>
            </div>
            <div className="row">
                <Calendario events={activities.map(x => {
                    const { id, actividad, fechainicio } = x;
                    return { 
                        id,
                        title: actividad,
                        date: new Date(fechainicio),
                        color: "#198754"
                    }
                })} onMonthChange={handleMonthChange} />
            </div>
        </div>
    );
}