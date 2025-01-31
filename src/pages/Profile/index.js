// import React from "react"
// import Breadcrumbs from "../../components/Common/Breadcrumb"
// import { Container } from "reactstrap"
//
// const Profile = () => {
//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           {/* Render Breadcrumb */}
//           <Breadcrumbs
//             title="Profile update"
//             breadcrumbItem="Profile"
//           />
//         </Container>
//       </div>
//     </React.Fragment>
//   )
// }
//
// export default Profile

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, UncontrolledTooltip, Input, Label, Row } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// FlatPickr
import "flatpickr/dist/themes/material_blue.css";
import FlatPickr from "react-flatpickr";

import * as Yup from "yup";
import { useFormik } from "formik";
import moment from "moment";
import SimpleBar from "simplebar-react";
import { projectAssignedTo } from "../../common/data";

const Profile = () => {

  //meta title
  document.title = "Create New Project | Skote - React Admin & Dashboard Template";

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgStore, setImgStore] = useState([]);
  const [dropList, setDropList] = useState(false);
  const [active, setActive] = useState(0)

  const handleAcceptedFiles = (files) => {
    const newImages = files?.map((file) => {
      return Object.assign(file, {
        priview: URL.createObjectURL(file),
      })
    })
    setSelectedFiles([...selectedFiles, ...newImages]);
  };

  //  img upload
  const handleImageChange = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      validation.setFieldValue('projectImage', reader.result)
    };
    reader.readAsDataURL(file);
  };


  const handleClick = (item) => {
    const isItemInImgStore = imgStore.some((imgItem) => imgItem.id === item.id);
    setActive(item.id)
    if (!isItemInImgStore) {
      const newData = [...imgStore, item];
      setImgStore(newData);
      validation.setFieldValue('assignedto', newData)
    } else {
      const newData = imgStore.filter((imgItem) => imgItem.id !== item.id)
      setImgStore(newData);
      validation.setFieldValue('assignedto', newData)
    }
  }

  // validation
  const validation = useFormik({
    initialValues: {
      hospital: '',
      doctorNo: "",
      username: '',
      email: '',
      assignedto: [],
      projectImage: '',
      img: '',
      startdate: '',
      // enddate: ''
    },
    validationSchema: Yup.object({
      hospital: Yup.string().required("Please Enter Your Hospital"),
      doctorNo: Yup.string().required("Please Enter Your Doctor Number"),
      username: Yup.string().required("Please Enter Your UserName"),
      email: Yup.string().required("Please Enter Your Email"),
      assignedto: Yup.array().min(1, "Please Select"),
      startdate: Yup.string().required("Please Enter Your Start Date"),
      projectImage: Yup.string().required("Please Select Image"),
    }),
    onSubmit: (values) => {
      // console.log(values);

    }
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Profile update" breadcrumbItem="Profile" />
          <Form
            id="createproject-form"
            onSubmit={e => {
              e.preventDefault()
              validation.handleSubmit()
              return false
            }}
          >
            <Row>
              <Col lg={3} />
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <input
                      type="hidden"
                      className="form-control"
                      id="formAction"
                      name="formAction"
                      defaultValue="add"
                    />
                    <input
                      type="hidden"
                      className="form-control"
                      id="project-id-input"
                    />

                    <div className="mb-3 text-center">
                      {/*<Label className="form-label">Profile Image</Label>*/}

                      {/*<div className="text-center">*/}
                      {/*  <div className="position-relative d-inline-block">*/}
                      {/*    <div className="position-absolute bottom-0 end-0">*/}
                      {/*      <Label htmlFor="project-image-input" className="mb-0" id="projectImageInput">*/}
                      {/*        <div className="avatar-xs">*/}
                      {/*          <div*/}
                      {/*            className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">*/}
                      {/*            <i className="bx bxs-image-alt"></i>*/}
                      {/*          </div>*/}
                      {/*        </div>*/}
                      {/*      </Label>*/}
                      {/*      <UncontrolledTooltip placement="right" target="projectImageInput">*/}
                      {/*        Select Image*/}
                      {/*      </UncontrolledTooltip>*/}
                      {/*      <input className="form-control d-none" id="project-image-input" type="file"*/}
                      {/*             accept="image/png, image/gif, image/jpeg" onChange={handleImageChange} />*/}
                      {/*    </div>*/}
                      {/*    <div className="avatar-lg">*/}
                      {/*      <div className="avatar-title bg-light rounded-circle">*/}
                      {/*        <img src={selectedImage || ''} id="projectlogo-img" alt=""*/}
                      {/*             className="avatar-md h-auto rounded-circle" />*/}
                      {/*      </div>*/}
                      {/*    </div>*/}
                      {/*  </div>*/}
                      {/*  {validation.touched.projectImage && validation.errors.projectImage ? (*/}
                      {/*    <FormFeedback type="invalid"*/}
                      {/*                  className="d-block">{validation.errors.projectImage}</FormFeedback>*/}
                      {/*  ) : null}*/}
                      {/*</div>*/}
                      <div className="text-center">
                        <div className="position-relative d-inline-block">
                          <div className="position-absolute bottom-0 end-0">
                            <Label
                              htmlFor="project-image-input"
                              className="mb-0"
                              id="projectImageInput"
                            >
                              <div
                                className="avatar-xs"
                                style={{ width: "48px", height: "48px" }}
                              >
                                <div
                                  className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow"
                                  style={{
                                    fontSize: "24px",
                                    width: "48px",
                                    height: "48px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <i
                                    className="bx bxs-image-alt"
                                    style={{ fontSize: "24px" }}
                                  ></i>
                                </div>
                              </div>
                            </Label>
                            <UncontrolledTooltip
                              placement="right"
                              target="projectImageInput"
                            >
                              Select Image
                            </UncontrolledTooltip>
                            <input
                              className="form-control d-none"
                              id="project-image-input"
                              type="file"
                              accept="image/png, image/gif, image/jpeg"
                              onChange={handleImageChange}
                            />
                          </div>

                          <div
                            className="avatar-lg"
                            style={{ width: "120px", height: "120px" }}
                          >
                            <div
                              className="avatar-title bg-light rounded-circle"
                              style={{ width: "120px", height: "120px" }}
                            >
                              <img
                                src={selectedImage || ""}
                                id="projectlogo-img"
                                alt=""
                                className="avatar-md h-auto rounded-circle"
                                style={{ width: "105px", height: "105px" }}
                              />
                            </div>
                          </div>
                        </div>

                        {validation.touched.projectImage &&
                        validation.errors.projectImage ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.projectImage}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="projectname-input">Hospital Name</Label>
                      <Input
                        id="hospital"
                        name="hospital"
                        type="text"
                        placeholder="Enter Hospital Name..."
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.hospital || ""}
                      />
                      {validation.touched.hospital &&
                      validation.errors.hospital ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.hospital}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="projectname-input">Doctor Number</Label>
                      <Input
                        id="doctornumber"
                        name="doctornumber"
                        type="text"
                        placeholder="Enter Doctor Number..."
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.doctornumber || ""}
                      />
                      {validation.touched.doctornumber &&
                      validation.errors.doctornumber ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.doctornumber}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="projectname-input">User Name</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter User Name..."
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.username || ""}
                      />
                      {validation.touched.username &&
                      validation.errors.username ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.username}
                        </FormFeedback>
                      ) : null}
                    </div>
                    {/*<div className="mb-3">*/}
                    {/*  <Label htmlFor="projectname-input">Project Name</Label>*/}
                    {/*  <Input*/}
                    {/*    id="projectname"*/}
                    {/*    name="projectname"*/}
                    {/*    type="text"*/}
                    {/*    placeholder="Enter Project Name..."*/}
                    {/*    onChange={validation.handleChange}*/}
                    {/*    onBlur={validation.handleBlur}*/}
                    {/*    value={validation.values.projectname || ""}*/}
                    {/*  />*/}
                    {/*  {validation.touched.projectname &&*/}
                    {/*  validation.errors.projectname ? (*/}
                    {/*    <FormFeedback type="invalid" className="d-block">*/}
                    {/*      {validation.errors.projectname}*/}
                    {/*    </FormFeedback>*/}
                    {/*  ) : null}*/}
                    {/*</div>*/}

                    {/*<div className="mb-3 position-relative">*/}
                    {/*  <Label htmlFor="task-assign-input">Assigned To</Label>*/}

                    {/*  <div*/}
                    {/*    className="avatar-group justify-content-center"*/}
                    {/*    id="assignee-member"*/}
                    {/*  >*/}
                    {/*    {(imgStore || [])?.map((item, idx) => (*/}
                    {/*      <React.Fragment key={idx}>*/}
                    {/*        <Link*/}
                    {/*          to="#"*/}
                    {/*          className="avatar-group-item mb-2"*/}
                    {/*          id={`assignee-member${idx}`}*/}
                    {/*        >*/}
                    {/*          <img*/}
                    {/*            src={item.imageSrc}*/}
                    {/*            alt=""*/}
                    {/*            className="rounded-circle avatar-xs"*/}
                    {/*          />*/}
                    {/*        </Link>*/}
                    {/*        <UncontrolledTooltip*/}
                    {/*          placement="top"*/}
                    {/*          target={`assignee-member${idx}`}*/}
                    {/*        >*/}
                    {/*          {item.name}*/}
                    {/*        </UncontrolledTooltip>*/}
                    {/*      </React.Fragment>*/}
                    {/*    ))}*/}
                    {/*  </div>*/}

                    {/*  <div className="select-element" id="select-element">*/}
                    {/*    <button*/}
                    {/*      className="btn btn-light w-100 d-flex justify-content-between"*/}
                    {/*      type="button"*/}
                    {/*      onClick={() => setDropList(!dropList)}*/}
                    {/*    >*/}
                    {/*      <span>*/}
                    {/*        Assigned To*/}
                    {/*        <b id="total-assignee" className="mx-1">*/}
                    {/*          {imgStore?.length || 0}*/}
                    {/*        </b>*/}
                    {/*        Members*/}
                    {/*      </span>{" "}*/}
                    {/*      <i className="mdi mdi-chevron-down"></i>*/}
                    {/*    </button>*/}
                    {/*    <div*/}
                    {/*      className={`w-100 dropdown-menu ${*/}
                    {/*        dropList ? "show" : ""*/}
                    {/*      }`}*/}
                    {/*    >*/}
                    {/*      <SimpleBar*/}
                    {/*        data-simplebar="init"*/}
                    {/*        style={{ maxHeight: "172px" }}*/}
                    {/*      >*/}
                    {/*        <ul className="list-unstyled mb-0 assignto-list">*/}
                    {/*          {(projectAssignedTo || [])?.map((item, index) => (*/}
                    {/*            <a*/}
                    {/*              className={`d-flex align-items-center dropdown-item ${*/}
                    {/*                active === item.id ? "active" : ""*/}
                    {/*              }`}*/}
                    {/*              href="#!"*/}
                    {/*              key={index}*/}
                    {/*              onClick={() => handleClick(item)}*/}
                    {/*            >*/}
                    {/*              <div className="avatar-xs flex-shrink-0 me-2">*/}
                    {/*                <img*/}
                    {/*                  src={item.imageSrc}*/}
                    {/*                  alt=""*/}
                    {/*                  className="img-fluid rounded-circle"*/}
                    {/*                />*/}
                    {/*              </div>*/}
                    {/*              <div className="flex-grow-1">{item.name}</div>*/}
                    {/*            </a>*/}
                    {/*          ))}*/}
                    {/*        </ul>*/}
                    {/*      </SimpleBar>*/}
                    {/*    </div>*/}
                    {/*  </div>*/}

                    {/*  {validation.touched.assignedto &&*/}
                    {/*  validation.errors.assignedto ? (*/}
                    {/*    <FormFeedback type="invalid" className="d-block">*/}
                    {/*      {validation.errors.assignedto}*/}
                    {/*    </FormFeedback>*/}
                    {/*  ) : null}*/}
                    {/*</div>*/}
                  </CardBody>
                </Card>
              </Col>
              <Col lg={3} />
            </Row>
            <Row>
              <Col lg={4} />
              <Col lg={4}>
                <div className="text-center mb-4">
                  <Button type="submit" color="primary">
                    Update Profile
                  </Button>
                </div>
              </Col>
              <Col lg={4} />
            </Row>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  )
};

export default Profile;
