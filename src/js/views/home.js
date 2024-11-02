import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link, useParamsm, useNavigate } from "react-router-dom";
import userImage from "../../img/user_image.jpg";

export const Home = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  const obtenerContactos = async () => {
    if (!store.nombreAgenda) {
      alert("No existen contactos");
      //Redirigir a NuevoContacto
    }

    const url = `https://playground.4geeks.com/contact/agendas/${store.nombreAgenda}/contacts`;
    try {
      console.log(`Haciendo fetch a: ${url}`);
      const response = await fetch(url);

      console.log(`Respuesta recibida: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setContacts(data.contacts);

      return `Agenda cargada correctamente`;
    } catch (e) {
      console.error(`Manejo interno del error: ${e.message}`);
      throw new Error(`Manejo interno del error. Error original: ${e.message}`);
    }
  };

  // const eliminarContacto = async () => {
  //   const nuevoContacto = {
  //     name: contactFullName,
  //     email: contactEmail,
  //     phone: contactPhone,
  //     address: contactAddress,
  //   };

  //   try {
  //     const response = await fetch(
  //       `https://playground.4geeks.com/contact/agendas/${store.nombreAgenda}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(nuevoContacto),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`Error en la respuesta: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("Contacto creado:", data);
  //     navigate("/"); // Redirigir después de crear el contacto
  //   } catch (error) {
  //     console.error("Error al crear el contacto:", error);
  //   }
  // };

  const crearAgenda = async (e) => {
    e.preventDefault();
    const nuevaAgenda = {
      slug: store.nombreAgenda,
      id: Math.random(),
    };

    try {
      const response = await fetch(
        `https://playground.4geeks.com/contact/agendas/${nuevaAgenda.slug}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevaAgenda),
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`);
      }

      const data = await response.json();
      console.log("Agenda creada:", data);
    } catch (error) {
      console.error("Error al crear la agenda:", error);
    }
  };

  const goEditContact = (e) => {
    console.log("Nos fuimos a editar el contacto ID", user.id);
    navigate(`/http://localhost:3000/editar-contacto/:${user.id}`);
  };
  useEffect(() => {}, []);
  return (
    <div className=" container p-2">
      <div className="d-flex flex-row p-2">
        <Link to="/http://localhost:3000/nuevo-contacto">
          <button className="btn btn-success ms-2">Crear contacto</button>
        </Link>
        <button
          onClick={() => obtenerContactos()}
          className="btn btn-outline-success ms-2"
        >
          Obtener contactos
        </button>
        {/* <!-- Button trigger modal --> */}
        <button
          type="button"
          className="btn btn-primary ms-2"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Crear agenda
        </button>

        {/* <!-- Modal --> */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
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
                <form onSubmit={crearAgenda}>
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
                      data-bs-dismiss="modal"
                      className="btn btn-primary"
                    >
                      Crear
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contactList m-1">
        {contacts.map((user) => (
          <div
            className="singleContact border rounded-2 d-flex flex-row m-1"
            key={user.id}
          >
            <div className="singleContactImg col-auto d-flex justify-content-center mx-4 my-auto">
              <img src={userImage} alt={user.name} />
            </div>
            <div className="col-9 ps-2">
              <h4>{user.name}</h4>
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
                  onClick={() => goEditContact(user.id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
