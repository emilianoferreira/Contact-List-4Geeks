import React from "react";
import { Link, useNavigate } from "react-router-dom";
const NuevoContacto = () => {
  const navigate = useNavigate;
  return (
    <div className="container">
      <div className="border px-2 py-2">
        <h1>Nuevo contacto</h1>
        <form>
          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="example@example.com"
            />
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">
              Full name
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="John Cena"
            />
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">
              Phone
            </label>
            <input
              type="number"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="598 984 423"
            />
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="18 de Julio 343"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            onClick={() => {
              console.log("hola");
              //hace el post de la info
              //el navigate para este caso debe usarse en el primer o segundo .then() del fetch
              navigate("/");
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevoContacto;
