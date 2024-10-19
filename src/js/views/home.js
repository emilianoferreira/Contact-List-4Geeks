import React from "react";
import rigoImage from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Link, useParams } from "react-router-dom";

const contact = [
  {
    name: "Juan",
    number: 2112321,
    email: "juan@4geeks.com",
    addres: "Rivera 212",
  },
  {
    name: "Pedro",
    number: 26452321,
    email: "Pedro@4geeks.com",
    addres: "Solano garcia 512",
  },
];
export const Home = () => {
  return (
    <div className=" container p-2 mt-5">
      <div className="d-flex flex-row p-5">
        <Link to="/http://localhost:3000/editar-contacto">
          <button className="btn btn-success ms-2">Editar contacto</button>
        </Link>
        <Link to="/http://localhost:3000/nuevo-contacto">
          <button className="btn btn-info ms-2">nuevo contacto</button>
        </Link>
      </div>
      <div className="contactList">
        {contact.map((user) => (
          <div className="singleContact border row">
            <div className="singleContactImg col-3">
              <img src="../../img/rigo-baby.jpg" />
            </div>
            <div className="col-7">
              <h5>{user.name}</h5>
              <p>
                <i class="fas fa-home"></i>
                {user.addres}
              </p>
              <p>
                <i class="fas fa-phone-alt"></i>
                {user.number}
              </p>
              <p>
                <i class="far fa-envelope"></i>
                {user.email}
              </p>
            </div>

            <div className="col-2 row">
              <div className="col-6">
                <i class="fas fa-pencil-alt"></i>
              </div>
              <div className="col-6">
                <i class="fas fa-trash-alt"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
