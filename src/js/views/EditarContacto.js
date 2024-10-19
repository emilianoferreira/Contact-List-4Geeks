import React from "react";
import { useParams } from "react-router-dom";

const EditarContacto = () => {
  const params = useParams();
  console.log(params);
  return (
    <div className="border ">
      <h1>Editar contacto</h1>
      <p>Información del contacto con ID: {params.theId}</p>
    </div>
  );
};

export default EditarContacto;
