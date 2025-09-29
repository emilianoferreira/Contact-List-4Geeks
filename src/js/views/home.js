import React, { useEffect, useContext, useState, useRef } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";
import userImage from "../../img/user_image.jpg";

export const Home = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const [agendaStatus, setAgendaStatus] = useState(null);
  const [isCreatingAgenda, setIsCreatingAgenda] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    actions.obtenerContactos();
  }, []);

  const goEditContact = (contactId) => {
    console.log(`Nos fuimos a editar el contacto ID: ${contactId}`);
    navigate(`/editar-contacto/${contactId}`);
  };

  const closeAgendaModal = () => {
    if (typeof document === "undefined") return;
    const modalElement = modalRef.current;
    if (!modalElement) return;

    if (typeof window !== "undefined" && window.bootstrap?.Modal) {
      const existingInstance = window.bootstrap.Modal.getInstance(modalElement);
      const modalInstance = existingInstance ||
        new window.bootstrap.Modal(modalElement);
      modalInstance.hide();
    } else {
      modalElement.classList.remove("show");
      modalElement.setAttribute("aria-hidden", "true");
      modalElement.removeAttribute("aria-modal");
      modalElement.style.display = "none";

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("paddingRight");
    }
  };

  const handleAgendaSubmit = async (event) => {
    event.preventDefault();
    setIsCreatingAgenda(true);
    setAgendaStatus(null);
    try {
      const result = await actions.crearAgenda();
      if (result) {
        setAgendaStatus(result);
        if (result.success) {
          closeAgendaModal();
          await actions.obtenerContactos();
        }
      }
    } finally {
      setIsCreatingAgenda(false);
    }
  };

  return (
    <div className=" container p-2">
      <div className="d-flex flex-row p-2">
        <button
          type="button"
          className="btn btn-primary ms-2"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Crear agenda
        </button>

        <button
          className="btn btn-success ms-2"
          disabled={!store.nombreAgenda} // Deshabilitar si no hay agenda
          onClick={() => {
            if (store.nombreAgenda) {
              navigate("/nuevo-contacto"); // Redirigir solo si hay agenda
            }
          }}
        >
          Crear contacto
        </button>

        <button
          onClick={() => actions.obtenerContactos()}
          className="btn btn-outline-success ms-2"
          disabled={
            store.nombreAgenda.length === 0 || store.contacts.length === 0
          }
        >
          Obtener contactos
        </button>

        {/* MODAL */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          ref={modalRef}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Crear agenda
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={handleAgendaSubmit}
                >
                  <label htmlFor="agendaName" className="form-label">
                    Nombre de la agenda
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="agendaName"
                    placeholder="Agenda Emi"
                    value={store.nombreAgenda}
                    onChange={(e) => actions.setNombreAgenda(e.target.value)}
                    required
                  />
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cerrar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isCreatingAgenda}
                    >
                      {isCreatingAgenda ? "Creando..." : "Crear"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {agendaStatus && (
        <div
          className={`alert alert-${agendaStatus.success ? "success" : "danger"}`}
          role="alert"
        >
          {agendaStatus.message}
        </div>
      )}
      <div className="contactList m-1">
        {store.nombreAgenda.length === 0 ? (
          <h3>No existe una agenda.</h3>
        ) : store.contacts.length === 0 ? (
          <h3>No existen contactos.</h3>
        ) : (
          store.contacts.map((user) => (
            <div
              className="singleContact border rounded-2 d-flex flex-row m-1"
              key={user.id}
            >
              <div className="singleContactImg col-auto d-flex justify-content-center mx-4 my-auto">
                <img src={userImage} alt={user.name} />
              </div>
              <div className="col-9 ps-2">
                <h4>
                  {user.name} - {user.id}
                </h4>
                <p>
                  <i className="fas fa-home pe-2"></i>
                  {user.address}
                </p>
                <p>
                  <i className="fas fa-phone-alt pe-2"></i>
                  {user.phone}
                </p>
                <p>
                  <i className="far fa-envelope pe-2"></i>
                  {user.email}
                </p>
              </div>

              <div className="col ">
                <div className="editContact h-50">
                  <button
                    className="btn btn-outline-success h-100 w-100"
                    onClick={() => goEditContact(user.id)}
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                </div>
                <div className="deleteContact h-50 ">
                  <button
                    className="btn btn btn-outline-danger h-100 w-100"
                    onClick={() => actions.eliminarContacto(user.id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
