import React from "react";
import { Link, useNavigate } from "react-router-dom";
const NuevoContacto = () => {
  const navigate = useNavigate;
  return (
    <div>
      <div className="border border-info">NuevoContacto</div>
      <button
        className="btn btn-primary"
        onClick={() => {
          console.log("hola");
          //hace el post de la info
          //el navigate para este caso debe usarse en el primer o segundo .then() del fetch
          navigate("/");
        }}
      >
        Crear contacto
      </button>
    </div>
  );
};

export default NuevoContacto;
