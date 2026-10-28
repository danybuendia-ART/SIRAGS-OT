import { Flame } from "lucide-react";
import "./target.css"
interface Proyecto {
    id: number;
    name: string;
    description: string;
    status: string;
    priority: string;
    solicitante: string;
    createdAt: string;
    tasks: []
}

interface TargetProps {
    proyectos: Proyecto[];
    seleccionarProyecto: (proyecto: Proyecto) => void;
}

export default function Target({
    proyectos,
    seleccionarProyecto,
}: TargetProps) {

    const salida = (info: any) => {
        //seleccionarProyecto(info)
        console.log(info)//el parametro es la informacion del proyecto seleccionado
    }
    return (
        <div className="d-flex overflow-auto gap-3 pb-3">
            {proyectos.map((proyecto) => {
                let tareas = proyecto.tasks
                let realizada = tareas.filter((p: any) => p.completed);

                const porcentaje_realizado = Number(realizada.length || 0) * 100 / Number(tareas.length) || 0;
                return (
                    (
                        <div
                            key={proyecto.id}
                            className={`card target flex-shrink-0 ${proyecto.priority ? "prioritario" : "normal"}`}
                            style={{ width: "300px", cursor: "pointer" }}
                            onClick={() => salida(proyecto)}
                            data-bs-container="body"
                            data-bs-toggle="popover"
                            data-bs-placement="top"
                            data-bs-content={proyecto.name}
                        >
                            <div className="card-body">
                                <div className="d-flex">
                                    <h5><Flame /> {proyecto.name.length > 20 ? proyecto.name.substring(0, 20) + "..." : proyecto.name}</h5>
                                    <p className="text-right">
                                        {new Date(proyecto.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <p >
                                    {proyecto.description.length > 150 ? proyecto.description.substring(0, 50) + "..." : proyecto.description}
                                </p>

                                <p>Progreso</p>
                                <p>realizadas: {realizada.length} / {tareas.length}</p>
                                <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                                    <div className="progress-bar" style={{ width: `${porcentaje_realizado}%` }}>{porcentaje_realizado.toFixed(0)} %</div>
                                </div>
                                <small>{proyecto.solicitante}</small>
                            </div>
                        </div>
                    )
                )
            })}
        </div>
    );
}