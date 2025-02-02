import React from "react";
import { Container } from "reactstrap";

// FlatPickr
import "flatpickr/dist/themes/material_blue.css";

import Uploader from "./Uploader";
import Annotation from "./Annotation";
import ViewPort from "./ViewPort";
import Multi from "./Multi";
import Viewer from "./Viewer";

const Contour = () => {

  //meta title
  document.title = "Contour | Raymed";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid className="d-flex flex-column align-items-center justify-content-center">
          {/* <Uploader/> */}
          {/* <ViewPort/> */}
          {/* <Multi/> */}
          <Viewer/>

          {/* <Annotation /> */}

        </Container>
      </div>
    </React.Fragment>
  )
};

export default Contour;
