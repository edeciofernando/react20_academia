import React from "react";

const Header = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 bg-danger text-white py-2">
          <img
            src="logo.png"
            alt="Treino"
            width="120"
            className="float-left mx-1"
          />
          <h1>Academia Avenida</h1>
          <h4>Registro de Treinos</h4>
        </div>
      </div>
    </div>
  );
};

export default Header;
