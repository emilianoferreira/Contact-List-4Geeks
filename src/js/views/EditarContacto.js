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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await actions.editarContacto(contactData, contacto.id);
    navigate("/");
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

            <form onSubmit={handleSubmit}>
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
                  name="email"
                  placeholder="example@example.com"
                  value={contactData.email}
                  onChange={handleChange}
                />
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
                  name="address"
                  placeholder="123 Main St"
                  value={contactData.address}
                  onChange={handleChange}
                />
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
