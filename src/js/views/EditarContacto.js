import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useParams, useNavigate } from "react-router-dom";

const EditarContacto = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();

  const contacto = store.contacts.find(
    (contact) => contact.id === parseInt(id)
  );

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (contacto) {
      setContactData({
        name: contacto.name,
        email: contacto.email,
        phone: contacto.phone,
        address: contacto.address,
      });
    }
  }, [contacto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData({ ...contactData, [name]: value });
  };

  const validateFields = () => {
    const newErrors = {};

    if (!contactData.name.trim()) {
      newErrors.name = "El nombre completo es obligatorio.";
    }

    if (!contactData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(contactData.email.trim())
    ) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (!contactData.phone.trim()) {
      newErrors.phone = "El número de teléfono es obligatorio.";
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(contactData.phone.trim())) {
      newErrors.phone = "Ingresa un teléfono válido (solo números, espacios o guiones).";
    }

    if (!contactData.address.trim()) {
      newErrors.address = "La dirección es obligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contacto) return;

    if (!validateFields()) {
      setStatusMessage({
        type: "danger",
        text: "Por favor corrige los errores antes de continuar.",
      });
      return;
    }

    setStatusMessage(null);
    const result = await actions.editarContacto(contactData, contacto.id);

    if (result) {
      setStatusMessage({
        type: result.success ? "success" : "danger",
        text: result.message,
      });

      if (result.success) {
        setErrors({});
        setTimeout(() => navigate("/"), 1200);
      }
    }
  };

  return (
    <div className="border ">
      <h1>Editar contacto</h1>
      {!contacto ? (
        <p>No se encontró el contacto.</p>
      ) : (
        <div className="container">
          <div className="border px-2 py-2">
            <div className="d-flex d-row justify-content-between">
              <p>Información del contacto con ID: {contacto.id}</p>
              <button className="btn" onClick={() => navigate("/")}>
                <i className="fas fa-angle-left"></i> Volver
              </button>
            </div>

            {statusMessage && (
              <div
                className={`alert alert-${statusMessage.type}`}
                role="alert"
              >
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
                  value={contactData.name}
                  onChange={handleChange}
                  required
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && (
                  <div className="text-danger small">{errors.name}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="contactEmail" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="contactEmail"
                  name="email"
                  placeholder="example@example.com"
                  value={contactData.email}
                  onChange={handleChange}
                  required
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <div className="text-danger small">{errors.email}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="contactPhone" className="form-label">
                  Phone
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="contactPhone"
                  name="phone"
                  placeholder="123-456-7890"
                  value={contactData.phone}
                  onChange={handleChange}
                  required
                  pattern="^\+?[0-9\s-]{7,15}$"
                  aria-invalid={errors.phone ? "true" : "false"}
                />
                {errors.phone && (
                  <div className="text-danger small">{errors.phone}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="contactAddress" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="contactAddress"
                  name="address"
                  placeholder="123 Main St"
                  value={contactData.address}
                  onChange={handleChange}
                  required
                  aria-invalid={errors.address ? "true" : "false"}
                />
                {errors.address && (
                  <div className="text-danger small">{errors.address}</div>
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarContacto;
