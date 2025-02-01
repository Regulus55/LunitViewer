import React from "react";
import { Container } from "reactstrap";

// FlatPickr
import "flatpickr/dist/themes/material_blue.css";
import Viewer from "./Viewer";
import Viewers from "./Viewers";
import Uploader from "./Uploader";

const Contour = () => {

  //meta title
  document.title = "Contour | Raymed";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid  className="d-flex flex-column align-items-center justify-content-center">
         {/* <Viewer/> */}
         <Uploader/>

        </Container>
      </div>
    </React.Fragment>
  )
};

export default Contour;
