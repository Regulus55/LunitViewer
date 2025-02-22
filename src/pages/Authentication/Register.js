import React, { useEffect } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback } from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { registerUser, apiError } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import { Link, useNavigate } from "react-router-dom";

// import images
import profileImg from "../../assets/images/profile-img.png";
import logoImg from "../../assets/images/logo.svg";

const Register = props => {

  //meta title
  document.title = "Register | Raymed";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      hospitalname: '',
      doctornumber: '',
      email: '',
      username: '',
      password: '',
      confirmpassword: '',
    },
    validationSchema: Yup.object({
      hospitalname: Yup.string().required("Please Enter Your Hospital Name"),
      doctornumber: Yup.string().required("Please Enter Your Doctor Number"),
      username: Yup.string().required("Please Enter Your Username"),
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
      confirmpassword: Yup.string().required("Please Enter Your Confirm Password"),
    }),
    onSubmit: (values) => {

      const {hospitalname, doctornumber, username, email, password, confirmpassword} = values;

      if (password !== confirmpassword) {
        alert("Passwords don't match");
        return;
      }

      const doctorNo = Number(doctornumber);

      const userInput = {
        hospitalname,
        doctorNo,
        username,
        email,
        password,
      }



      console.log(userInput);

      // dispatch(registerUser(values));
    }
  });


  const AccountProperties = createSelector(
    (state) => state.Account,
    (account) => ({
      user: account.user,
      registrationError: account.registrationError,
      success: account.success
      // loading: account.loading,
    })
  );

  const {
    user,
    registrationError, success
    // loading
  } = useSelector(AccountProperties);

  useEffect(() => {
    dispatch(apiError(""));
  }, []);

  useEffect(() => {
    success && setTimeout(() => navigate("/login"), 2000)
  }, [success])

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary-subtle">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Create User</h5>
                        <p>Get your Raymed account now.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          {/*<img*/}
                          {/*  src={logoImg}*/}
                          {/*  alt=""*/}
                          {/*  className="rounded-circle"*/}
                          {/*  height="34"*/}
                          {/*/>*/}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      {user && user ? (
                        <Alert color="success">
                          Register User Successfully
                        </Alert>
                      ) : null}

                      {registrationError && registrationError ? (
                        <Alert color="danger">{registrationError}</Alert>
                      ) : null}

                      <div className="mb-3">
                        <Label className="form-label">Hospital Name</Label>
                        <Input
                          name="hospitalname"
                          type="text"
                          placeholder="Enter hospital name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.hospitalname || ""}
                          invalid={
                            validation.touched.hospitalname && validation.errors.hospitalname ? true : false
                          }
                        />
                        {validation.touched.hospitalname && validation.errors.hospitalname ? (
                          <FormFeedback type="invalid">{validation.errors.hospitalname}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Doctor Number</Label>
                        <Input
                          name="doctornumber"
                          type="text"
                          placeholder="Enter doctor number"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.doctornumber || ""}
                          invalid={
                            validation.touched.doctornumber && validation.errors.doctornumber ? true : false
                          }
                        />
                        {validation.touched.doctornumber && validation.errors.doctornumber ? (
                          <FormFeedback type="invalid">{validation.errors.doctornumber}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Username</Label>
                        <Input
                          name="username"
                          type="text"
                          placeholder="Enter username"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.username || ""}
                          invalid={
                            validation.touched.username && validation.errors.username ? true : false
                          }
                        />
                        {validation.touched.username && validation.errors.username ? (
                          <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email ? true : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        ) : null}
                      </div>


                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password || ""}
                          invalid={
                            validation.touched.password && validation.errors.password ? true : false
                          }
                        />
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Confirm Password</Label>
                        <Input
                          name="confirmpassword"
                          type="password"
                          placeholder="Enter Confirm Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.confirmpassword || ""}
                          invalid={
                            validation.touched.confirmpassword && validation.errors.confirmpassword ? true : false
                          }
                        />
                        {validation.touched.confirmpassword && validation.errors.confirmpassword ? (
                          <FormFeedback type="invalid">{validation.errors.confirmpassword}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mt-4">
                        <button
                          className="btn btn-primary btn-block "
                          type="submit"
                        >
                          Create Account
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="mb-0">
                          By registering you agree to the Raymed{" "}
                          <Link to="#" className="text-primary">
                            Terms of Use
                          </Link>
                        </p>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Already have an account ?{" "} <Link to="/login" className="font-weight-medium text-primary">
                  {" "}
                  Login
                </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Raymed. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Raymed
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Register;
