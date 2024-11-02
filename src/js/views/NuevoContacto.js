import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const NuevoContacto = () => {
  const [contactFullName, setContactFullName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  const handleClick = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    crearContacto();
  };

  const crearContacto = async () => {
    const nuevoContacto = {
      name: contactFullName,
      email: contactEmail,
      phone: contactPhone,
      address: contactAddress,
    };

    try {
      const response = await fetch(
        `https://playground.4geeks.com/contact/agendas/${store.nombreAgenda}/contacts`,
        {
          method: "POST", // Cambiado a POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoContacto),
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`);
      }

      const data = await response.json();
      console.log("Contacto creado:", data);
      navigate("/"); // Redirigir después de crear el contacto
    } catch (error) {
      console.error("Error al crear el contacto:", error);
    }
  };

  return (
    <div className="container">
      <div className="border px-2 py-2">
        <div className="d-flex d-row justify-content-between">
          <h1>Nuevo contacto</h1>
          <button className="btn" onClick={() => navigate("/")}>
            <i className="fas fa-angle-left"></i> Volver
          </button>
        </div>

        <form onSubmit={handleClick}>
          <div className="mb-3">
            <label htmlFor="contactFullName" className="form-label">
              Full name
            </label>
            <input
              type="text"
              className="form-control"
              id="contactFullName"
              placeholder="John Cena"
              value={contactFullName}
              onChange={(e) => setContactFullName(e.target.value)} // Captura el valor
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contactEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="contactEmail"
              aria-describedby="emailHelp"
              placeholder="example@example.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)} // Captura el valor
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contactPhone" className="form-label">
              Phone
            </label>
            <input
              type="text" // Cambiado a "text" para permitir formatos más flexibles
              className="form-control"
              id="contactPhone"
              placeholder="598 984 423"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)} // Captura el valor
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contactAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="contactAddress"
              placeholder="18 de Julio 343"
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)} // Captura el valor
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Crear contacto
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevoContacto;
