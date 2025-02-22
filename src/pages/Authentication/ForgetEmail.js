import PropTypes from "prop-types";
import React from "react";
import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { Link } from "react-router-dom";
import withRouter from "components/Common/withRouter";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userForgetPassword } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.svg";

const ForgetEmailPage = props => {

  //meta title
  document.title = "Forget Password | Raymed";

  const dispatch = useDispatch();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      doctornumber: '',
      username: '',
    },
    validationSchema: Yup.object({
      doctornumber: Yup.string().required("Please Enter Your Doctor Number"),
      username: Yup.string().required("Please Enter Your Username"),
    }),
    onSubmit: (values) => {


      const userInput = {
        doctorNo: Number(values.doctornumber),
        username: values.username,
      }

      console.log(userInput);

      // dispatch(userForgetPassword(values, props.history));
    }
  });


  const ForgotPasswordProperties = createSelector(
    (state) => state.ForgetPassword,
    (forgetPassword) => ({
      forgetError: forgetPassword.forgetError,
      forgetSuccessMsg: forgetPassword.forgetSuccessMsg,
    })
  );

  const {
    forgetError,
    forgetSuccessMsg
  } = useSelector(ForgotPasswordProperties);

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
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Sign in to continue to Raymed.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          {/*<img*/}
                          {/*  src={logo}*/}
                          {/*  alt=""*/}
                          {/*  className="rounded-circle"*/}
                          {/*  height="34"*/}
                          {/*/>*/}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    {forgetError && forgetError ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {forgetError}
                      </Alert>
                    ) : null}
                    {forgetSuccessMsg ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {forgetSuccessMsg}
                      </Alert>
                    ) : null}

                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">Doctor No.</Label>
                        <Input
                          name="doctornumber"
                          className="form-control"
                          placeholder="Enter Doctor Number"
                          type="text"
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
                        <Label className="form-label">User Name</Label>
                        <Input
                          name="username"
                          className="form-control"
                          placeholder="Enter username"
                          type="text"
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
                      <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md "
                            type="submit"
                          >
                            Find Email
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link to="/login" className="font-weight-medium text-primary">
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

ForgetEmailPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetEmailPage);
