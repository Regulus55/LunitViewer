import React, { useCallback, useState } from "react"
import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  Form,
  FormGroup,
  Label,
  CardBody,
  CardTitle,
  CardSubtitle
} from "reactstrap"
import { Link } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup";
import classnames from "classnames"
import Dropzone from "react-dropzone";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";


//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//Import Images
import img1 from "../../assets/images/product/img-1.png"
import img7 from "../../assets/images/product/img-7.png"
import * as PropTypes from "prop-types"
import * as dcmjs from "dcmjs";
import axios from "axios"

const optionGroup = [
  {
    label: "Picnic",
    options: [
      { label: "Mustard", value: "Mustard" },
      { label: "Ketchup", value: "Ketchup" },
      { label: "Relish", value: "Relish" },
    ],
  },
  {
    label: "Camping",
    options: [
      { label: "Tent", value: "Tent" },
      { label: "Flashlight", value: "Flashlight" },
      { label: "Toilet Paper", value: "Toilet Paper" },
    ],
  },
]

const orderSummary = [
  {
    id: 1,
    img: img1,
    productTitle: "Half sleeve T-shirt (64GB)",
    price: 450,
    qty: 1,
  },
  { id: 2, img: img7, productTitle: "Wireless Headphone", price: 225, qty: 1 },
]

Dropzone.propTypes = {
  onDrop: PropTypes.func,
  children: PropTypes.func,
}
const Dashboard = () => {
  //meta title
  document.title = "Checkout | Skote - React Admin & Dashboard Template"

  const [activeTab, setActiveTab] = useState("1")
  const [selectedGroup, setSelectedGroup] = useState(null)

  const [petct_selectedFiles, setPETCT_SelectedFiles] = useState([]);
  // const [ct_selectedFiles, setCT_SelectedFiles] = useState([]);
  // const [pet_selectedFiles, setPET_SelectedFiles] = useState([]);

  // console.log("+++++++++++++++++", ct_selectedFiles)

// cornerstone-wado-image-loader 초기화
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

// Web Worker 설정
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    webWorkerPath: "/cornerstoneWADOImageLoaderWebWorker.js",
    taskConfiguration: {
      decodeTask: {
        codecsPath: "/cornerstoneWADOImageLoaderCodecs.js",
      },
    },
  });

  const uploadPETCTFilesToServer = async () => {
    if (petct_selectedFiles.length === 0) {
      alert("업로드할 파일이 없습니다.");
      return;
    }

    const formData = new FormData();

    // ✅ id 추가 (예: 사용자 ID 또는 환자 ID)
    const patientId = "12345";  // 예시 ID 값
    // formData.append("id", patientId);

    petct_selectedFiles.forEach((file, index) => {
      formData.append(`dicoms`, file);  // 서버에서 'files'로 받음
      // console.log(`파일 ${index + 1}:`, file);  // 파일 정보 출력
    });

    // // ✅ FormData 내용 확인
    // for (let pair of formData.entries()) {
    //   console.log(`${pair[0]}:`, pair[1]);  // key, value 출력
    // }

    try {
      const { data, status } = await axios.post(
        `http://192.168.0.29:7070/study/auto-seg/${patientId}`,
        // "http://192.168.0.29:7071/auto-seg/",
        formData,
        {
          responseType: 'blob'  // ✅ 응답 타입을 Blob으로 설정
        }
      )

      console.log("-----------------------", status)
      console.log("%%%%%%%%%%%%%%%%%%%%%%%", data);

      // ✅ 응답 데이터(Blob)를 다운로드 처리
      const blob = new Blob([data], { type: "application/dicom" });  // DICOM 파일 MIME 타입
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download =  `${patientId}.dcm`;  // ✅ 다운로드 파일 이름 설정
      document.body.appendChild(link);
      link.click();  // ✅ 자동 다운로드 실행

      // ✅ 사용한 URL 해제 및 링크 제거
      window.URL.revokeObjectURL(url);
      link.remove();

      alert("파일이 성공적으로 다운로드되었습니다.");

    } catch (error) {
      console.error("파일 업로드 오류:", error.message);
      alert("서버 오류가 발생했습니다.");
    }
  };

  // DICOM 파일을 미리보기 이미지로 변환
  const generatePreview = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const dicomData = dcmjs.data.DicomMessage.readFile(new Uint8Array(e.target.result));
          const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);

          const pixelData = dataset.PixelData;
          const rows = dataset.Rows;
          const columns = dataset.Columns;
          const bitsAllocated = dataset.BitsAllocated;

          if (pixelData && rows && columns) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = columns;
            canvas.height = rows;

            let imageData = context.createImageData(columns, rows);
            let pixelArray;

            // 8-bit grayscale 이미지로 변환
            if (bitsAllocated === 8) {
              pixelArray = new Uint8Array(pixelData);
              for (let i = 0; i < pixelArray.length; i++) {
                const value = pixelArray[i];
                imageData.data[i * 4] = value;     // R
                imageData.data[i * 4 + 1] = value; // G
                imageData.data[i * 4 + 2] = value; // B
                imageData.data[i * 4 + 3] = 255;   // A
              }
            } else {
              resolve("https://via.placeholder.com/80x80?text=DICOM");
              return;
            }

            context.putImageData(imageData, 0, 0);
            const previewImage = canvas.toDataURL("image/png");
            resolve(previewImage);
          } else {
            resolve("https://via.placeholder.com/80x80?text=DICOM");
          }
        } catch (error) {
          console.error("DICOM 파싱 오류:", error);
          resolve("https://via.placeholder.com/80x80?text=Error");
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

// Cornerstone 설정
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    webWorkerPath: "/cornerstoneWADOImageLoaderWebWorker.js",
    taskConfiguration: {
      decodeTask: {
        codecsPath: "/cornerstoneWADOImageLoaderCodecs.js",
      },
    },
  });

// 파일 처리
  const handlePETCTAcceptedFiles = (files) => {
    files.forEach((file) => {
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);

      const updatedFiles = files.map((file) => {
        file.preview = URL.createObjectURL(file); // 썸네일 URL 생성
        file.formattedSize = formatFileSize(file.size); // 파일 크기 변환
        return file;
      });
      // setSelectedFiles((prevFiles) => [...prevFiles, ...updatedFiles]);

      cornerstone.loadAndCacheImage(imageId).then((image) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        cornerstone.renderToCanvas(canvas, image);

        const previewURL = canvas.toDataURL("image/png");
        file.preview = previewURL;

        setPETCT_SelectedFiles((prevFiles) => [...prevFiles, file]);
      });
    });
  };

  // const handlePETAcceptedFiles = (files) => {
  //   files.forEach((file) => {
  //     const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
  //
  //     const updatedFiles = files.map((file) => {
  //       file.preview = URL.createObjectURL(file); // 썸네일 URL 생성
  //       file.formattedSize = formatFileSize(file.size); // 파일 크기 변환
  //       return file;
  //     });
  //     // setSelectedFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
  //
  //     cornerstone.loadAndCacheImage(imageId).then((image) => {
  //       const canvas = document.createElement("canvas");
  //       const context = canvas.getContext("2d");
  //       canvas.width = image.width;
  //       canvas.height = image.height;
  //       cornerstone.renderToCanvas(canvas, image);
  //
  //       const previewURL = canvas.toDataURL("image/png");
  //       file.preview = previewURL;
  //
  //       setPET_SelectedFiles((prevFiles) => [...prevFiles, file]);
  //     });
  //   });
  // };
// 파일 크기를 사람이 읽기 쉬운 형식으로 변환하는 함수
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validation = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      states: "",
      order: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter your Name"),
      email: Yup.string().email().required("Please Enter your Email Address"),
      phone: Yup.string().required("Please Enter your Phone"),
      address: Yup.string().required("Please Enter your Address"),
      country: Yup.string().required("Please Enter your Country Name"),
      states: Yup.string().required("Please Enter your States"),
      order: Yup.string().required("Please Enter your Order Note"),
    }),
    onSubmit: values => {
      // console.log(values)
    },
  })

  const handleNextTab = () => {
    const nextTab = (parseInt(activeTab) + 1).toString();
    setActiveTab(nextTab);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title="Import Dicom files"
            breadcrumbItem="Patient Management"
          />

          <div className="checkout-tabs">
            <Row>
              <Col xl={2} sm={3}>
                <Nav className="flex-column" pills>
                  {/*<NavItem>*/}
                  {/*  <NavLink*/}
                  {/*    className={classnames({ active: activeTab === "1" })}*/}
                  {/*    onClick={() => {*/}
                  {/*      setActiveTab("1")*/}
                  {/*    }}*/}
                  {/*  >*/}
                  {/*    <i className="bx bxs-truck d-block check-nav-icon mt-4 mb-2" />*/}
                  {/*    <p className="fw-bold mb-4">Import CT Dicom files</p>*/}
                  {/*  </NavLink>*/}
                  {/*</NavItem>*/}
                  {/*<NavItem>*/}
                  {/*  <NavLink*/}
                  {/*    className={classnames({ active: activeTab === "2" })}*/}
                  {/*    onClick={() => {*/}
                  {/*      setActiveTab("2")*/}
                  {/*    }}*/}
                  {/*  >*/}
                  {/*    <i className="bx bxs-truck d-block check-nav-icon mt-4 mb-2" />*/}
                  {/*    <p className="fw-bold mb-4">Import PET Dicom files</p>*/}
                  {/*  </NavLink>*/}
                  {/*</NavItem>*/}
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => {
                        setActiveTab("1")
                      }}
                    >
                      <i className="bx bxs-truck d-block check-nav-icon mt-4 mb-2" />
                      <p className="fw-bold mb-4">Import PET-CT Dicom files</p>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "3" })}
                      onClick={() => {
                        setActiveTab("3")
                      }}
                    >
                      <i className="bx bx-money d-block check-nav-icon mt-4 mb-2" />
                      <p className="fw-bold mb-4">Register Patient Info</p>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "4" })}
                      onClick={() => {
                        setActiveTab("4")
                      }}
                    >
                      <i className="bx bx-badge-check d-block check-nav-icon mt-4 mb-2" />
                      <p className="fw-bold mb-4">Confirmation</p>
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col xl={10} sm={9}>
                <Card>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <Row>
                          <Col className="col-12">
                            <Card>
                              <CardBody>
                                <h6 className="card-title">
                                  Import PET-CT DICOM files
                                </h6>
                                <CardSubtitle className="mb-3">
                                  Please upload PET-CT DICOM files (.dcm)
                                </CardSubtitle>
                                <Form>
                                  <Dropzone
                                    onDrop={handlePETCTAcceptedFiles}
                                    accept={{
                                      "application/dicom": [".dcm", ".dicom"],
                                    }}
                                  >
                                    {({ getRootProps, getInputProps }) => (
                                      <div className="dropzone">
                                        <div
                                          className="dz-message needsclick mt-2"
                                          {...getRootProps()}
                                        >
                                          <input {...getInputProps()} />
                                          <div className="mb-3">
                                            <i className="display-4 text-muted bx bxs-cloud-upload" />
                                          </div>
                                          <h4>
                                            Drop PET-CT DICOM files here or click to
                                            upload.
                                          </h4>
                                        </div>
                                      </div>
                                    )}
                                  </Dropzone>

                                  <div
                                    className="dropzone-previews mt-3"
                                    id="file-previews"
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "repeat(6, 1fr)",
                                      gap: "10px",
                                    }}
                                  >
                                    {petct_selectedFiles.map((f, i) => (
                                      <Card
                                        className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                        key={i + "-file"}
                                        style={{ width: "100%" }}
                                      >
                                        <div className="p-2">
                                          <div className="text-center">
                                            <img
                                              data-dz-thumbnail=""
                                              height="80"
                                              className="avatar-sm rounded bg-light"
                                              alt={f.name || "DICOM File"}
                                              src={
                                                f.preview ||
                                                "https://via.placeholder.com/80x80?text=DICOM"
                                              }
                                              style={{
                                                objectFit: "cover",
                                                width: "100%",
                                              }}
                                            />
                                          </div>
                                          <div className="text-center mt-2">
                                            <Link
                                              to="#"
                                              className="text-muted font-weight-bold"
                                              style={{ fontSize: "12px" }}
                                            >
                                              {f.name && f.name.length > 10
                                                ? f.name.substring(0, 16) +
                                                  "..."
                                                : f.name || "Unnamed"}
                                            </Link>
                                            <p
                                              className="mb-0"
                                              style={{ fontSize: "10px" }}
                                            >
                                              <strong>
                                                {f.formattedSize || "0 KB"}
                                              </strong>
                                            </p>
                                          </div>
                                        </div>
                                      </Card>
                                    ))}
                                  </div>
                                </Form>

                                <div className="text-center mt-4">
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={uploadPETCTFilesToServer}
                                  >
                                    Send Files
                                  </button>
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      </TabPane>
                      {/*<TabPane tabId="2">*/}
                      {/*  <Row>*/}
                      {/*    <Col className="col-12">*/}
                      {/*      <Card>*/}
                      {/*        <CardBody>*/}
                      {/*          <h6 className="card-title">*/}
                      {/*            Import DICOM files*/}
                      {/*          </h6>*/}
                      {/*          <CardSubtitle className="mb-3">*/}
                      {/*            Please upload PET DICOM files (.dcm)*/}
                      {/*          </CardSubtitle>*/}
                      {/*          <Form>*/}
                      {/*            <Dropzone*/}
                      {/*              onDrop={handlePETAcceptedFiles}*/}
                      {/*              accept={{*/}
                      {/*                "application/dicom": [".dcm", ".dicom"],*/}
                      {/*              }}*/}
                      {/*            >*/}
                      {/*              {({ getRootProps, getInputProps }) => (*/}
                      {/*                <div className="dropzone">*/}
                      {/*                  <div*/}
                      {/*                    className="dz-message needsclick mt-2"*/}
                      {/*                    {...getRootProps()}*/}
                      {/*                  >*/}
                      {/*                    <input {...getInputProps()} />*/}
                      {/*                    <div className="mb-3">*/}
                      {/*                      <i className="display-4 text-muted bx bxs-cloud-upload" />*/}
                      {/*                    </div>*/}
                      {/*                    <h4>*/}
                      {/*                      Drop PET DICOM files here or click*/}
                      {/*                      to upload.*/}
                      {/*                    </h4>*/}
                      {/*                  </div>*/}
                      {/*                </div>*/}
                      {/*              )}*/}
                      {/*            </Dropzone>*/}

                      {/*            <div*/}
                      {/*              className="dropzone-previews mt-3"*/}
                      {/*              id="file-previews"*/}
                      {/*              style={{*/}
                      {/*                display: "grid",*/}
                      {/*                gridTemplateColumns: "repeat(8, 1fr)",*/}
                      {/*                gap: "10px",*/}
                      {/*              }}*/}
                      {/*            >*/}
                      {/*              {pet_selectedFiles.map((f, i) => (*/}
                      {/*                <Card*/}
                      {/*                  className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"*/}
                      {/*                  key={i + "-file"}*/}
                      {/*                  style={{ width: "100%" }}*/}
                      {/*                >*/}
                      {/*                  <div className="p-2">*/}
                      {/*                    <div className="text-center">*/}
                      {/*                      <img*/}
                      {/*                        data-dz-thumbnail=""*/}
                      {/*                        height="80"*/}
                      {/*                        className="avatar-sm rounded bg-light"*/}
                      {/*                        alt={f.name || "DICOM File"}*/}
                      {/*                        src={*/}
                      {/*                          f.preview ||*/}
                      {/*                          "https://via.placeholder.com/80x80?text=DICOM"*/}
                      {/*                        }*/}
                      {/*                        style={{*/}
                      {/*                          objectFit: "cover",*/}
                      {/*                          width: "100%",*/}
                      {/*                        }}*/}
                      {/*                      />*/}
                      {/*                    </div>*/}
                      {/*                    <div className="text-center mt-2">*/}
                      {/*                      <Link*/}
                      {/*                        to="#"*/}
                      {/*                        className="text-muted font-weight-bold"*/}
                      {/*                        style={{ fontSize: "12px" }}*/}
                      {/*                      >*/}
                      {/*                        {f.name && f.name.length > 10*/}
                      {/*                          ? f.name.substring(0, 10) +*/}
                      {/*                            "..."*/}
                      {/*                          : f.name || "Unnamed"}*/}
                      {/*                      </Link>*/}
                      {/*                      <p*/}
                      {/*                        className="mb-0"*/}
                      {/*                        style={{ fontSize: "12px" }}*/}
                      {/*                      >*/}
                      {/*                        <strong>*/}
                      {/*                          {f.formattedSize || "0 KB"}*/}
                      {/*                        </strong>*/}
                      {/*                      </p>*/}
                      {/*                    </div>*/}
                      {/*                  </div>*/}
                      {/*                </Card>*/}
                      {/*              ))}*/}
                      {/*            </div>*/}
                      {/*          </Form>*/}

                      {/*          <div className="text-center mt-4">*/}
                      {/*            <button*/}
                      {/*              type="button"*/}
                      {/*              className="btn btn-primary"*/}
                      {/*              onClick={handleNextTab}*/}
                      {/*            >*/}
                      {/*              Send Files*/}
                      {/*            </button>*/}
                      {/*          </div>*/}
                      {/*        </CardBody>*/}
                      {/*      </Card>*/}
                      {/*    </Col>*/}
                      {/*  </Row>*/}
                      {/*</TabPane>*/}
                      <TabPane tabId="2" id="v-pills-payment" role="tabpanel"
                               aria-labelledby="v-pills-payment-tab">
                        <div>
                          <CardTitle>Register PatientInfo </CardTitle>
                          <p className="card-title-desc">
                            Fill all information PatientInfo
                          </p>
                          <div>
                            <FormGroup
                              check
                              className="form-check-inline font-size-16"
                            >
                              <Input
                                type="radio"
                                value="1"
                                id="customRadioInline1"
                                name="customRadioInline1"
                                className="form-check-input"
                                defaultChecked
                              />
                              <Label
                                check
                                className="font-size-13"
                                htmlFor="customRadioInline1"
                              >
                                {/*<i className="fab fa-cc-mastercard me-1 font-size-20 align-top" />{" "}*/}
                                Doctor
                              </Label>
                            </FormGroup>
                            <div className="form-check form-check-inline font-size-16">
                              <Input
                                type="radio"
                                value="2"
                                id="customRadioInline2"
                                name="customRadioInline1"
                                className="form-check-input"
                              />
                              <Label
                                className="form-check-label font-size-13"
                                htmlFor="customRadioInline2"
                              >
                                {/*<i className="fab fa-cc-paypal me-1 font-size-20 align-top" />{" "}*/}
                                Nurse
                              </Label>
                            </div>
                            <div className="form-check form-check-inline font-size-16">
                              <Input
                                type="radio"
                                value="3"
                                id="customRadioInline3"
                                name="customRadioInline1"
                                className="form-check-input"
                              />
                              <Label
                                className="form-check-label font-size-13"
                                htmlFor="customRadioInline3"
                              >
                                {/*<i className="far fa-money-bill-alt me-1 font-size-20 align-top" />{" "}*/}
                                Hospital Officials
                              </Label>
                            </div>
                          </div>

                          <h5 className="mt-5 mb-3 font-size-15">
                            For card Payment
                          </h5>
                          <div className="p-4 border">
                            {/*<Form>*/}
                            {/*  <div className="form-group mb-0">*/}
                            {/*    <Label htmlFor="cardnumberInput">*/}
                            {/*      Card Number{" "}*/}
                            {/*    </Label>*/}
                            {/*    <Input*/}
                            {/*      type="text"*/}
                            {/*      className="form-control"*/}
                            {/*      id="cardNumberInput"*/}
                            {/*      placeholder="0000 0000 0000 0000"*/}
                            {/*    />*/}
                            {/*  </div>*/}
                            {/*  <Row>*/}
                            {/*    <Col lg="6">*/}
                            {/*      <div className="form-group mt-4 mb-0">*/}
                            {/*        <Label htmlFor="cardnameInput">*/}
                            {/*          Name on card{" "}*/}
                            {/*        </Label>*/}
                            {/*        <Input*/}
                            {/*          type="text"*/}
                            {/*          className="form-control"*/}
                            {/*          id="cardnameInput"*/}
                            {/*          placeholder="Name on Card"*/}
                            {/*        />*/}
                            {/*      </div>*/}
                            {/*    </Col>*/}
                            {/*    <Col lg="3">*/}
                            {/*      <div className="form-group mt-4 mb-0">*/}
                            {/*        <Label htmlFor="expirydateInput">*/}
                            {/*          {" "}*/}
                            {/*          Expiry date{" "}*/}
                            {/*        </Label>*/}
                            {/*        <Input*/}
                            {/*          type="text"*/}
                            {/*          className="form-control"*/}
                            {/*          id="expirydateInput"*/}
                            {/*          placeholder="MM/YY"*/}
                            {/*        />*/}
                            {/*      </div>*/}
                            {/*    </Col>*/}
                            {/*    <Col lg="3">*/}
                            {/*      <div className="form-group mt-4 mb-0">*/}
                            {/*        <Label htmlFor="cvvcodeInput">*/}
                            {/*          {" "}*/}
                            {/*          CVV Code*/}
                            {/*        </Label>*/}
                            {/*        <Input*/}
                            {/*          type="text"*/}
                            {/*          className="form-control"*/}
                            {/*          id="cvvcodeInput"*/}
                            {/*          placeholder="Enter CVV Code"*/}
                            {/*        />*/}
                            {/*      </div>*/}
                            {/*    </Col>*/}
                            {/*  </Row>*/}
                            {/*</Form>*/}
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleNextTab}
                          >
                            Send Files
                          </button>
                        </div>
                      </TabPane>
                      <TabPane tabId="3" id="v-pills-confir" role="tabpanel">
                        <Card className="shadow-none border mb-0">
                          <CardBody>
                            <CardTitle className="mb-4">
                              {" "}
                              Order Summary
                            </CardTitle>

                            <div className="table-responsive">
                              <Table className="table align-middle mb-0 table-nowrap">
                                <thead className="table-light">
                                  <tr>
                                    <th scope="col">Product</th>
                                    <th scope="col">Product Desc</th>
                                    <th scope="col">Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(orderSummary || [])?.map(
                                    (orderItem, key) => (
                                      <tr key={"_orderSummary_" + key}>
                                        <th scope="row">
                                          <img
                                            src={orderItem.img}
                                            alt="product-img"
                                            title="product-img"
                                            className="avatar-md"
                                          />
                                        </th>
                                        <td>
                                          <h5 className="font-size-14 text-truncate">
                                            <Link
                                              to="/ecommerce-product-detail"
                                              className="text-dark"
                                            >
                                              {orderItem.productTitle}{" "}
                                            </Link>
                                          </h5>
                                          <p className="text-muted mb-0">
                                            $ {orderItem.price} x{" "}
                                            {orderItem.qty}
                                          </p>
                                        </td>
                                        <td>
                                          $ {orderItem.price * orderItem.qty}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                  <tr>
                                    <td colSpan={2}>
                                      <h6 className="m-0 text-end">
                                        Sub Total:
                                      </h6>
                                    </td>
                                    <td>$ 675</td>
                                  </tr>
                                  <tr>
                                    <td colSpan={3}>
                                      <div className="bg-primary-subtle p-3 rounded">
                                        <h5 className="font-size-14 text-primary mb-0">
                                          <i className="fas fa-shipping-fast me-2" />{" "}
                                          Shipping{" "}
                                          <span className="float-end">
                                            Free
                                          </span>
                                        </h5>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan={2}>
                                      <h6 className="m-0 text-end">Total:</h6>
                                    </td>
                                    <td>$ 675</td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </CardBody>
                        </Card>
                        <div className="text-center mt-4">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleNextTab}
                          >
                            Send Files
                          </button>
                        </div>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
                {/*<Row className="mt-4">*/}
                {/*  <Col sm="6"></Col>*/}
                {/*  <Col sm="6">*/}
                {/*    <div className="text-sm-end">*/}
                {/*      <Link*/}
                {/*        to="/ecommerce-checkout"*/}
                {/*        className="btn btn-success"*/}
                {/*      >*/}
                {/*        <i className="mdi mdi-truck-fast me-1" /> Proceed to*/}
                {/*        Shipping{" "}*/}
                {/*      </Link>*/}
                {/*    </div>*/}
                {/*  </Col>*/}
                {/*</Row>*/}
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Dashboard;
