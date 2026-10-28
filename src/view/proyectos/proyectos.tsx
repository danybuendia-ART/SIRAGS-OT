import { useState, useEffect, type FormEvent } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Flame,
    FolderOpen,
    Plus,
    Search,
} from "lucide-react";
import "./proyectos.css";
import Target from "../../components/target/target";
import { apiRequest, decryptData } from "../../utils/api";

export default function Proyects() {
    const [proyectosGral, setProyectos] = useState<any[]>([]);


    let priority = [];
    let Proyectos = []
    const [nombreProyecto, setNombreProyecto] = useState("");
    const [descripcionProyecto, setDescripcion] = useState("");
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    useEffect(() => {
        getProyects()
    }, [])

    const getProyects = async () => {
        const response = decryptData(await apiRequest("proyectos", null, "GET"));
        setProyectos(response);

    }

    const addProject = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    priority = proyectosGral.filter((p: any) => p.priority);// se dividen los proyectos si son prioritarios o no
    Proyectos = proyectosGral.filter((p: any) => !p.priority);// se dividen los proyectos si son prioritarios o no


    return (
        <main className="projects-page">
            <header className="projects-hero">
                <div className="projects-hero-copy">
                    <div className="projects-eyebrow">
                        <FolderOpen size={16} aria-hidden="true" />
                        Gestión de proyectos
                    </div>
                    <p>Organiza la programación y da seguimiento a cada iniciativa.</p>
                </div>

                <div className="projects-filters">
                    <div className="projects-date-field">
                        <label>Fecha de inicio</label>
                        <input type="date" className="form-control" />
                    </div>
                    <div className="projects-date-field">
                        <label>Fecha de cierre</label>
                        <input type="date" className="form-control" />
                    </div>
                    <button className="projects-filter-button btn" type="button">
                        <Search size={17} aria-hidden="true" />
                        Buscar
                    </button>

                </div>
                <button
                    className="projects-primary-button"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                >
                    <Plus size={19} aria-hidden="true" />
                    Programar proyecto
                </button>
            </header>

            <section className="projects-summary" aria-label="Resumen de proyectos">
                <article className="projects-stat-card">
                    <div className="projects-stat-icon projects-stat-icon-blue">
                        <CalendarDays size={20} aria-hidden="true" />
                    </div>
                    <div>
                        <p>Actividades programadas</p>
                        <strong>---</strong>
                        <span>Resumen general</span>
                    </div>
                </article>
                <article className="projects-stat-card">
                    <div className="projects-stat-icon projects-stat-icon-amber">
                        <Flame size={20} aria-hidden="true" />
                    </div>
                    <div>
                        <p>Actividades prioritarias</p>
                        <strong>{priority.length}</strong>
                        <span>Requieren atención</span>
                    </div>
                </article>
                <article className="projects-stat-card">
                    <div className="projects-stat-icon projects-stat-icon-green">
                        <CheckCircle2 size={20} aria-hidden="true" />
                    </div>
                    <div>
                        <p>Proyectos registrados</p>
                        <strong>{Proyectos.length}</strong>
                        <span>En seguimiento</span>
                    </div>
                </article>
            </section>

            <section className="projects-list-panel" aria-labelledby="projects-list-title">
                <div className="projects-list-heading">
                    <div>
                        <h2 id="projects-list-title"><Flame style={{ color: "orange" }} /> Proyectos Prioritarios</h2>
                        <p></p>
                    </div>
                    <span className="projects-list-tag">Todos los proyectos</span>
                </div>

                {priority.length > 0 ? (
                    <Target proyectos={priority} seleccionarProyecto={proyectoSeleccionado} />
                ) : (
                    <div className="projects-empty-state">
                        {/* Estado vacío */}
                    </div>
                )}
            </section>
            <section className="projects-list-panel mt-4" aria-labelledby="projects-list-title">
                <div className="projects-list-heading">
                    <div>

                        <h2 id="projects-list-title"><FolderOpen /> Proyectos </h2>
                        <p>Proyectos registrados recientemente.</p>
                    </div>
                    <span className="projects-list-tag">Todos los proyectos</span>
                </div>
                {priority.length > 0 ? (
                    <Target proyectos={Proyectos} seleccionarProyecto={proyectoSeleccionado} />
                ) : (
                    <div className="projects-empty-state">
                        {/* Estado vacío */}
                    </div>
                )}
            </section>

            <div
                className="modal fade projects-modal"
                id="exampleModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div>
                                <span className="projects-section-label">Nueva iniciativa</span>
                                <h2 className="modal-title" id="exampleModalLabel">Programar proyecto</h2>
                            </div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <form onSubmit={addProject}>
                            <div className="modal-body">
                                <div className="projects-form-field">
                                    <label htmlFor="project-name" className="form-label">Nombre del proyecto</label>
                                    <input
                                        id="project-name"
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej. Mantenimiento de línea 3"
                                        value={nombreProyecto}
                                        onChange={(event) => setNombreProyecto(event.target.value)}
                                        required
                                    />
                                </div>
                                <div className="projects-form-field">
                                    <label htmlFor="project-description" className="form-label">Descripción</label>
                                    <textarea
                                        id="project-description"
                                        className="form-control"
                                        placeholder="Describe brevemente el objetivo del proyecto"
                                        rows={3}
                                        value={descripcionProyecto}
                                        onChange={(event) => setDescripcion(event.target.value)}
                                    />
                                </div>
                                <div className="projects-form-grid">
                                    <div className="projects-form-field">
                                        <label htmlFor="project-plant" className="form-label">Planta</label>
                                        <select id="project-plant" className="form-select" defaultValue="Planta 1">
                                            <option value="Planta 1">Planta 1</option>
                                            <option value="Power Train">Power Train</option>
                                        </select>
                                    </div>
                                    <div className="projects-form-field">
                                        <label htmlFor="project-owner" className="form-label">Responsable</label>
                                        <select id="project-owner" className="form-select" defaultValue="">
                                            <option value="" disabled>Seleccionar responsable</option>
                                        </select>
                                    </div>
                                    <div className="projects-form-field">
                                        <label htmlFor="project-quantity" className="form-label">Cantidad</label>
                                        <input id="project-quantity" type="number" step="0.01" min="0" className="form-control" placeholder="0.00" />
                                    </div>
                                    <div className="projects-form-field">
                                        <label htmlFor="project-unit" className="form-label">Unidad</label>
                                        <input id="project-unit" type="text" className="form-control" placeholder="Ej. piezas" />
                                    </div>
                                </div>
                                <label className="projects-priority-option" htmlFor="project-priority">
                                    <span className="projects-priority-icon"><Flame size={18} aria-hidden="true" /></span>
                                    <span>
                                        <strong>Proyecto prioritario</strong>
                                        <small>Destacar para dar seguimiento especial</small>
                                    </span>
                                    <input id="project-priority" type="checkbox" className="form-check-input" />
                                </label>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="projects-cancel-button" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" className="projects-primary-button">Registrar proyecto</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main >
    );
}
