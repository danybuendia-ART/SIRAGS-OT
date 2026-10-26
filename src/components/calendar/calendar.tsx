import { useEffect, useMemo, useState } from "react";
import "./calendar.css";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  assignedTo?: string;
  color?: string;
}

interface CalendarProps {
  events: CalendarEvent[];
  onMonthChange?: (month: string, count: number) => void;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function Calendario({ events, onMonthChange }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [currentDate, setCurrentDate] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [comment, setComment] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};

    events.forEach((event) => {
      if (
        Number.isNaN(event.date.getTime()) ||
        event.date.getFullYear() !== year ||
        event.date.getMonth() !== month
      ) {
        return;
      }

      const day = event.date.getDate();
      map[day] ??= [];
      map[day].push(event);
    });

    return map;
  }, [events, year, month]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
  const selectedEvents = eventsByDay[selectedDate.getDate()] ?? [];
  const monthlyEventCount = Object.values(eventsByDay).reduce(
    (total, dayEvents) => total + dayEvents.length,
    0,
  );

  useEffect(() => {
    onMonthChange?.(`${MONTHS[month]} ${year}`, monthlyEventCount);
  }, [month, monthlyEventCount, onMonthChange, year]);

  useEffect(() => {
    if (!activeEvent) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveEvent(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeEvent]);

  const changeMonth = (amount: number) => {
    const nextMonth = new Date(year, month + amount, 1);
    setCurrentDate(nextMonth);
    setSelectedDate(nextMonth);
  };

  const openEvent = (event: CalendarEvent) => {
    setActiveEvent(event);
    setComment("");
    setIsCompleted(false);
    setFiles([]);
  };

  const closeEvent = () => setActiveEvent(null);

  return (
    <section className="calendar-layout" aria-label="Calendario de actividades">
      <div className="calendar-panel card shadow-sm w-100">
        <div className="card-header calendar-header">
          <button
            type="button"
            className="btn btn-outline-secondary"
            aria-label="Mes anterior"
            onClick={() => changeMonth(-1)}
          >
            ←
          </button>
          <h2 className="calendar-month mb-0">
            {MONTHS[month]} {year}
          </h2>
          <span className="calendar-month-total">
            {monthlyEventCount} {monthlyEventCount === 1 ? "actividad" : "actividades"}
          </span>
          <button
            type="button"
            className="btn btn-outline-secondary"
            aria-label="Mes siguiente"
            onClick={() => changeMonth(1)}
          >
            →
          </button>
        </div>

        <div className="card-body calendar-body">
          <div className="calendar-weekdays" aria-hidden="true">
            {DAYS.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {Array.from({ length: totalCells }, (_, index) => {
              const day = index - offset + 1;
              const valid = day >= 1 && day <= daysInMonth;

              if (!valid) {
                return <div key={index} className="calendar-empty-day" aria-hidden="true" />;
              }

              const dayEvents = eventsByDay[day] ?? [];
              const isSelected =
                selectedDate.getFullYear() === year &&
                selectedDate.getMonth() === month &&
                selectedDate.getDate() === day;

              return (
                <button
                  key={index}
                  type="button"
                  className={`calendar-day${isSelected ? " is-selected" : ""}`}
                  aria-pressed={isSelected}
                  aria-label={`${day} de ${MONTHS[month]}, ${dayEvents.length} actividades`}
                  onClick={() => setSelectedDate(new Date(year, month, day))}
                >
                  <span className="calendar-day-number">{day}</span>
                  <span className="calendar-day-events">
                    {dayEvents.slice(0, 3).map((event) => (
                      <span
                        key={event.id}
                        className="calendar-event-badge"
                        style={{ backgroundColor: event.color ?? "#0d6efd", color: "black"}}
                        title={event.title}

                      >
                        {event.title}
                      </span>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="calendar-event-overflow">
                        +{dayEvents.length - 3} más
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="calendar-activities card shadow-sm" aria-live="polite">
        <div className="card-body">
          <p className="calendar-sidebar-label mb-1">Agenda del día</p>
          <h2 className="calendar-sidebar-date">
            {selectedDate.toLocaleDateString("es-MX", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h2>
          <p className="calendar-sidebar-count">
            {selectedEvents.length}{" "}
            {selectedEvents.length === 1 ? "actividad programada" : "actividades programadas"}
          </p>

          {selectedEvents.length > 0 ? (
            <ul className="calendar-activity-list">
              {selectedEvents.map((event) => (
                <li className="calendar-activity" key={event.id}>
                  <span
                    className="calendar-activity-marker"
                    style={{ backgroundColor: event.color ?? "#0d6efd" }}
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    className="calendar-activity-content calendar-activity-button"
                    onClick={() => openEvent(event)}
                  >
                    <span className="calendar-activity-title">{event.title}</span>
                    {(event.date.getHours() !== 0 || event.date.getMinutes() !== 0) && (
                      <time dateTime={event.date.toISOString()}>
                        {event.date.toLocaleTimeString("es-MX", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="calendar-no-activities mb-0">
              No hay actividades para este día.
            </p>
          )}
        </div>
      </aside>

      {activeEvent && (
        <div
          className="activity-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEvent();
          }}
        >
          <section
            className="activity-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="activity-dialog-title"
          >
            <header className="activity-dialog-header">
              <div>
                <p className="calendar-sidebar-label mb-1">Detalle de actividad</p>
                <h2 id="activity-dialog-title">{activeEvent.title}</h2>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar diálogo"
                onClick={closeEvent}
              />
            </header>

            <div className="activity-dialog-details">
              <div>
                <span>Trabajador asignado</span>
                <strong>{activeEvent.assignedTo || "No especificado"}</strong>
              </div>
              <div>
                <span>Fecha</span>
                <strong>
                  {activeEvent.date.toLocaleDateString("es-MX", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </div>
            </div>

            <form
              className="activity-followup-form"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="activity-followup-fields">
                <div>
                  <label className="form-label" htmlFor="activity-comment">
                    Comentario de la actividad
                  </label>
                  <textarea
                    id="activity-comment"
                    className="form-control"
                    rows={5}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Escribe un comentario..."
                  />
                  <label className="activity-completed-control">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isCompleted}
                      onChange={(event) => setIsCompleted(event.target.checked)}
                    />
                    <span>Marcar actividad como finalizada</span>
                  </label>
                </div>

                <div>
                  <label className="form-label" htmlFor="activity-files">
                    Archivos adjuntos
                  </label>
                  <label className="activity-file-dropzone" htmlFor="activity-files">
                    <span className="activity-file-icon" aria-hidden="true">＋</span>
                    <span>Selecciona archivos para adjuntar</span>
                    <small>Elige uno o más archivos de tu dispositivo</small>
                  </label>
                  <input
                    id="activity-files"
                    className="visually-hidden"
                    type="file"
                    multiple
                    onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
                  />
                  {files.length > 0 && (
                    <ul className="activity-file-list">
                      {files.map((file) => (
                        <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <p className="activity-form-notice mb-0">
                El comentario, el estado y los archivos aún no se guardan en el servidor.
              </p>
            </form>

            <footer className="activity-dialog-footer">
              <button type="button" className="btn btn-secondary" onClick={closeEvent}>
                Cerrar
              </button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}
