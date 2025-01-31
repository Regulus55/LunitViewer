import React from "react";
import { Container } from "reactstrap";

// FlatPickr
import "flatpickr/dist/themes/material_blue.css";
import Viewer from "./Viewer";

const Contour = () => {

  //meta title
  document.title = "Contour | Raymed";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
         <Viewer/>

        </Container>
      </div>
    </React.Fragment>
  )
};

export default Contour;
