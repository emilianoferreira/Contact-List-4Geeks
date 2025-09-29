import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const NuevoContacto = () => {
  const [contactFullName, setContactFullName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  const validateFields = () => {
    const newErrors = {};

    if (!contactFullName.trim()) {
      newErrors.name = "El nombre completo es obligatorio.";
    }

    if (!contactEmail.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(contactEmail.trim())
    ) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (!contactPhone.trim()) {
      newErrors.phone = "El número de teléfono es obligatorio.";
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(contactPhone.trim())) {
      newErrors.phone = "Ingresa un teléfono válido (solo números, espacios o guiones).";
    }

    if (!contactAddress.trim()) {
      newErrors.address = "La dirección es obligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const crearContacto = async () => {
    if (!validateFields()) {
      return {
        success: false,
        message: "Por favor corrige los errores antes de continuar.",
      };
    }

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
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoContacto),
        }
      );

      if (!response.ok) {
        let errorMessage = `Error en la respuesta: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData?.msg) errorMessage = errorData.msg;
        } catch (jsonError) {
          console.warn("No se pudo parsear el error del contacto", jsonError);
        }
        return { success: false, message: errorMessage };
      }

      const data = await response.json();
      await actions.obtenerContactos();
      return {
        success: true,
        message:
          data?.message ||
          data?.msg ||
          "Contacto creado correctamente.",
      };
    } catch (error) {
      console.error("Error al crear el contacto:", error);
      return {
        success: false,
        message: "No se pudo crear el contacto. Intenta nuevamente.",
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    const result = await crearContacto();
    if (!result) return;

    setStatusMessage({
      type: result.success ? "success" : "danger",
      text: result.message,
    });

    if (result.success) {
      setErrors({});
      setContactFullName("");
      setContactEmail("");
      setContactPhone("");
      setContactAddress("");
      setTimeout(() => navigate("/"), 1200);
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

        {statusMessage && (
          <div className={`alert alert-${statusMessage.type}`} role="alert">
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="contactFullName" className="form-label">
              Full name
            </label>
            <input
              type="text"
              className="form-control"
              id="contactFullName"
              name="name"
              placeholder="John Cena"
              value={contactFullName}
              onChange={(e) => setContactFullName(e.target.value)}
              required
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && <div className="text-danger small">{errors.name}</div>}
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
              onChange={(e) => setContactEmail(e.target.value)}
              required
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && <div className="text-danger small">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="contactPhone" className="form-label">
              Phone
            </label>
            <input
              type="text"
              className="form-control"
              id="contactPhone"
              placeholder="598 984 423"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
              pattern="^\+?[0-9\s-]{7,15}$"
              aria-invalid={errors.phone ? "true" : "false"}
            />
            {errors.phone && <div className="text-danger small">{errors.phone}</div>}
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
              onChange={(e) => setContactAddress(e.target.value)}
              required
              aria-invalid={errors.address ? "true" : "false"}
            />
            {errors.address && (
              <div className="text-danger small">{errors.address}</div>
            )}
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
