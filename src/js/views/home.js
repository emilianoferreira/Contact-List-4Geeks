import React, { useEffect, useContext, useState, useRef } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";
import userImage from "../../img/user_image.jpg";

export const Home = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const [agendaStatus, setAgendaStatus] = useState(null);
  const [agendasModalStatus, setAgendasModalStatus] = useState(null);
  const [isCreatingAgenda, setIsCreatingAgenda] = useState(false);
  const [isLoadingAgendas, setIsLoadingAgendas] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const modalRef = useRef(null);
  const agendasModalRef = useRef(null);

  useEffect(() => {
    actions.obtenerAgendas();
  }, []);

  useEffect(() => {
    if (store.nombreAgenda) {
      actions.obtenerContactos();
    }
  }, [store.nombreAgenda]);

  const goEditContact = (contactId) => {
    console.log(`Nos fuimos a editar el contacto ID: ${contactId}`);
    navigate(`/editar-contacto/${contactId}`);
  };

  const hideModalElement = (modalElement) => {
    if (typeof document === "undefined") return;
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

  const closeAgendaModal = () => {
    hideModalElement(modalRef.current);
  };

  const closeAgendasModal = () => {
    hideModalElement(agendasModalRef.current);
    actions.limpiarAgendaPreview();
    setAgendasModalStatus(null);
    setIsPreviewLoading(false);
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
        }
      }
    } finally {
      setIsCreatingAgenda(false);
    }
  };

  const handleConsultAgendas = async () => {
    setAgendasModalStatus(null);
    setIsPreviewLoading(false);
    actions.limpiarAgendaPreview();
    setIsLoadingAgendas(true);
    const result = await actions.obtenerAgendas();
    if (!result?.success) {
      setAgendasModalStatus({
        type: "danger",
        text: result?.message || "No fue posible obtener las agendas registradas.",
      });
    } else if (result.agendas?.length === 0) {
      setAgendasModalStatus({
        type: "info",
        text: "Aún no hay agendas registradas.",
      });
    }
    setIsLoadingAgendas(false);
  };

  const handlePreviewAgenda = async (slug) => {
    setAgendasModalStatus(null);
    setIsPreviewLoading(true);
    const result = await actions.previsualizarAgenda(slug);
    if (!result?.success) {
      setAgendasModalStatus({
        type: "danger",
        text:
          result?.message ||
          "No fue posible previsualizar los contactos de esta agenda.",
      });
    } else if (result.contacts?.length === 0) {
      setAgendasModalStatus({
        type: "info",
        text: "Esta agenda no tiene contactos registrados todavía.",
      });
    }
    setIsPreviewLoading(false);
  };

  const handleSelectAgenda = async (slug) => {
    setAgendasModalStatus(null);
    const result = await actions.seleccionarAgenda(slug);
    if (!result?.success) {
      setAgendasModalStatus({
        type: "danger",
        text:
          result?.message ||
          "No se pudo activar la agenda seleccionada. Intenta nuevamente.",
      });
      return;
    }

    setAgendaStatus({
      success: true,
      message: `Agenda "${slug}" seleccionada correctamente.`,
    });
    closeAgendasModal();
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
          type="button"
          className="btn btn-outline-primary ms-2"
          data-bs-toggle="modal"
          data-bs-target="#agendasModal"
          onClick={handleConsultAgendas}
        >
          Consultar agendas
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
                      onClick={() => setAgendaStatus(null)}
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
      <div
        className="modal fade"
        id="agendasModal"
        tabIndex="-1"
        aria-labelledby="agendasModalLabel"
        aria-hidden="true"
        ref={agendasModalRef}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="agendasModalLabel">
                Agendas disponibles
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeAgendasModal}
              ></button>
            </div>
            <div className="modal-body">
              {agendasModalStatus && (
                <div
                  className={`alert alert-${agendasModalStatus.type}`}
                  role="alert"
                >
                  {agendasModalStatus.text}
                </div>
              )}
              {isLoadingAgendas ? (
                <p>Cargando agendas...</p>
              ) : store.agendas.length === 0 ? (
                <p className="mb-0">No hay agendas registradas todavía.</p>
              ) : (
                <div className="row g-3">
                  <div className="col-12 col-lg-5">
                    <ul className="list-group">
                      {store.agendas.map((agenda) => {
                        const slug = agenda.slug || "";
                        const isActivePreview =
                          store.agendaPreview.slug === slug;
                        return (
                          <li
                            key={slug}
                            className={`list-group-item d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center ${isActivePreview ? "active" : ""}`}
                          >
                            <div className="me-lg-3">
                              <strong>{slug}</strong>
                              {agenda.created_at && (
                                <div className="small mb-1 mb-lg-0">
                                  Creada: {new Date(agenda.created_at).toLocaleString()}
                                </div>
                              )}
                            </div>
                            <div className="d-flex gap-2 mt-2 mt-lg-0">
                              <button
                                type="button"
                                className={`btn btn-sm ${isActivePreview ? "btn-light" : "btn-outline-secondary"}`}
                                onClick={() => handlePreviewAgenda(slug)}
                                disabled={isPreviewLoading && isActivePreview}
                              >
                                {isActivePreview && isPreviewLoading
                                  ? "Cargando..."
                                  : "Previsualizar"}
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => handleSelectAgenda(slug)}
                              >
                                Usar agenda
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="col-12 col-lg-7">
                    <h2 className="h5">
                      {store.agendaPreview.slug
                        ? `Contactos en "${store.agendaPreview.slug}"`
                        : "Selecciona una agenda para ver sus contactos"}
                    </h2>
                    {isPreviewLoading ? (
                      <p>Cargando contactos...</p>
                    ) : store.agendaPreview.slug ? (
                      store.agendaPreview.contacts.length > 0 ? (
                        <ul className="list-group">
                          {store.agendaPreview.contacts.map((contact) => (
                            <li
                              key={contact.id}
                              className="list-group-item"
                            >
                              <div className="fw-semibold">{contact.name}</div>
                              <div className="small text-muted">{contact.email}</div>
                              <div className="small">{contact.phone}</div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mb-0">
                          Esta agenda aún no tiene contactos cargados.
                        </p>
                      )
                    ) : (
                      <p className="mb-0">
                        Usa el botón "Previsualizar" para explorar los contactos de
                        una agenda.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={closeAgendasModal}
              >
                Cerrar
              </button>
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
