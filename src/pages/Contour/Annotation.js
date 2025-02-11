import React, { useCallback, useEffect, useRef, useState } from 'react';
import InsightViewer, { useFrame, useImage, useMultipleImages } from '@lunit/insight-viewer';
import { AnnotationOverlay } from '@lunit/insight-viewer/annotation';
import { Col, Row } from 'reactstrap';
import { useViewport } from '@lunit/insight-viewer/viewport'
import OverlayLayer from './OverlayLayer';
import DicomHeader from './DicomHeader';
import DragAndDropImage from './DragAndDropImage';
import { useDropzone } from 'react-dropzone';

const INITIAL_VIEWPORT1 = {
    scale: 1,
    windowWidth: 90,
    windowCenter: 32,
    x: 0,
    y: 0,
    invert: false,
    hflip: false,
    vflip: false,
};

const annotationData = [
    {
        id: 1,
        name: 'Polygon',
        value: 'polygon'
    },
    {
        id: 2,
        name: 'Line',
        value: 'line'
    },
    {
        id: 3,
        name: 'Arrow Line',
        value: 'arrowLine'
    },
    {
        id: 4,
        name: 'Free Line',
        value: 'freeLine'
    },
    {
        id: 5,
        name: 'Point',
        value: 'point'
    },
    {
        id: 6,
        name: 'Text',
        value: 'text'
    },
    {
        id: 7,
        name: 'Ruler',
        value: 'ruler'
    },
    {
        id: 8,
        name: 'Area',
        value: 'area'
    },
]


const IMAGES = [
    "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.724.1165.dcm",
    "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.728.1168.dcm",
    "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.731.1169.dcm",

    // "wadouri:http://localhost:9000/beecouple/PET/2.16.840.1.114362.1.11890052.23347336132.553945885.170.1041.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=A9IL72OX0PLLO2UX8X4P%2F20250204%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250204T144239Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJBOUlMNzJPWDBQTExPMlVYOFg0UCIsImV4cCI6MTczODcyMjc3OCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.BilH41WxXprFQ-TKCvynTZAulA5QNXxV_70A2ewAhzZGYOyh4sOz5pG77xI2g-vz3FBSSIky2vMCCqanQF5yuw&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=02e6041914fe536f56f95a03b02011f5efb57dfc6565f947100aa54c97fcdafd",
    // "wadouri:http://localhost:9000/beecouple/PET/2.16.840.1.114362.1.11890052.23347336132.553945885.174.1044.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=A9IL72OX0PLLO2UX8X4P%2F20250204%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250204T144342Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJBOUlMNzJPWDBQTExPMlVYOFg0UCIsImV4cCI6MTczODcyMjc3OCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.BilH41WxXprFQ-TKCvynTZAulA5QNXxV_70A2ewAhzZGYOyh4sOz5pG77xI2g-vz3FBSSIky2vMCCqanQF5yuw&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=04f420bf5124ca2d8e70bd0aab4610ef09afb9a68ec4b8fd0c24ddd339dbe82c",
    // "wadouri:http://localhost:9000/beecouple/PET/2.16.840.1.114362.1.11890052.23347336132.553945885.177.1045.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=A9IL72OX0PLLO2UX8X4P%2F20250204%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250204T144400Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJBOUlMNzJPWDBQTExPMlVYOFg0UCIsImV4cCI6MTczODcyMjc3OCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.BilH41WxXprFQ-TKCvynTZAulA5QNXxV_70A2ewAhzZGYOyh4sOz5pG77xI2g-vz3FBSSIky2vMCCqanQF5yuw&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=0a61bb6c74c31bbbe868ee3c17ac0fc23420c1b73aa999d47b0bea7c4bda9591",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.734.1170.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1QNJN9GDRZ2F312U5Y3V%2F20250205%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250205T070357Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiIxUU5KTjlHRFJaMkYzMTJVNVkzViIsImV4cCI6MTczODc4MjE3NSwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bH-mqcIDUyi3ukjyGUxLGaXc8v6Rfax7sZ4vjL9N8BhtcFMTi7q0PMI7rHHGx9gUE-57O-AIT2_dJcupi0tOvg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=6992a89887fc4344099819f5a6186b8efbce0afa577b0368df203488f499504b",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.736.1171.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1QNJN9GDRZ2F312U5Y3V%2F20250205%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250205T070406Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiIxUU5KTjlHRFJaMkYzMTJVNVkzViIsImV4cCI6MTczODc4MjE3NSwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bH-mqcIDUyi3ukjyGUxLGaXc8v6Rfax7sZ4vjL9N8BhtcFMTi7q0PMI7rHHGx9gUE-57O-AIT2_dJcupi0tOvg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=b0505dad0d9566c2c85f9d5c6bfe9722a88f53b53d520dc9ee01ec02ff1a1dbd",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.739.1172.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1QNJN9GDRZ2F312U5Y3V%2F20250205%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250205T070444Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiIxUU5KTjlHRFJaMkYzMTJVNVkzViIsImV4cCI6MTczODc4MjE3NSwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bH-mqcIDUyi3ukjyGUxLGaXc8v6Rfax7sZ4vjL9N8BhtcFMTi7q0PMI7rHHGx9gUE-57O-AIT2_dJcupi0tOvg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=df538fb8bf017055fd0db3f4a4ef769a57c60d51d204e7d451dc2247a2a777be",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.741.1173.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1QNJN9GDRZ2F312U5Y3V%2F20250205%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250205T070458Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiIxUU5KTjlHRFJaMkYzMTJVNVkzViIsImV4cCI6MTczODc4MjE3NSwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bH-mqcIDUyi3ukjyGUxLGaXc8v6Rfax7sZ4vjL9N8BhtcFMTi7q0PMI7rHHGx9gUE-57O-AIT2_dJcupi0tOvg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=2225004605e99ef4c82469829f0d64cc3e5fd214bdd89c6dcd087ce4b465f6a3",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.744.1174.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1QNJN9GDRZ2F312U5Y3V%2F20250205%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250205T070505Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiIxUU5KTjlHRFJaMkYzMTJVNVkzViIsImV4cCI6MTczODc4MjE3NSwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bH-mqcIDUyi3ukjyGUxLGaXc8v6Rfax7sZ4vjL9N8BhtcFMTi7q0PMI7rHHGx9gUE-57O-AIT2_dJcupi0tOvg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=51e1809598a1e254528bd2a3c193f935119ec419754aa39898f885cd9586a8c9",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.746.1175.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1QNJN9GDRZ2F312U5Y3V%2F20250205%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250205T070513Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiIxUU5KTjlHRFJaMkYzMTJVNVkzViIsImV4cCI6MTczODc4MjE3NSwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bH-mqcIDUyi3ukjyGUxLGaXc8v6Rfax7sZ4vjL9N8BhtcFMTi7q0PMI7rHHGx9gUE-57O-AIT2_dJcupi0tOvg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=c3f436242795d83031c4ef4f02cfecfa386ad1a0c123bfb96bbcca8944c8367c",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.749.1176.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=1QNJN9GDRZ2F312U5Y3V%2F20250205%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250205T070520Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiIxUU5KTjlHRFJaMkYzMTJVNVkzViIsImV4cCI6MTczODc4MjE3NSwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bH-mqcIDUyi3ukjyGUxLGaXc8v6Rfax7sZ4vjL9N8BhtcFMTi7q0PMI7rHHGx9gUE-57O-AIT2_dJcupi0tOvg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=518cd033e7bcb6ea82e4ad117ff0aab22ce2479b7e1b3aaf4f0f7b3931e21de6",
];

export default function Annotation() {
    const [isDrawing, setIsDrawing] = useState(false)
    const [labelShow, setLabelShow] = useState(false)
    const [annotationMode, setAnnotationMode] = useState('polygon')



    
    const [dcmFiles, setDcmFiles] = useState([]);

  const [parseError, setParseError] = useState("");
    const [sopInstanceUid, setSopInstanceUid] = useState("");
    const [patientId, setPatientId] = useState("");
    const [patientName, setPatientName] = useState("");
    const [patientSex, setPatientSex] = useState("");
    const [patientBirthDate, setPatientBirthDate] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [patientWeight, setPatientWeight] = useState("");

    const onDrop = useCallback(acceptedFiles => {
        console.log('Dropped files:', acceptedFiles); // 드래그한 파일 확인
    
        // acceptedFiles 배열에서 각 파일의 경로를 "wadouri:" 접두사를 붙여 새로운 배열로 생성
        const updatedImages = acceptedFiles.map(file => {
            return `wadouri:/images/${file.name}`;  // 파일 이름을 기반으로 경로 생성
        });
    
        setDcmFiles(updatedImages);  // IMAGES 상태에 새로운 파일 경로 배열 설정
    
        clearPage();
        loadFile(acceptedFiles);  // 필요시 파일 읽기
    }, []);
    


useEffect(()=>{
    console.log('dasdfasdf',dcmFiles)
},[dcmFiles])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    function clearPage() {
        setParseError('');
        setSopInstanceUid('');
        setPatientId('');
        setPatientName('');
        setPatientSex('');
        setPatientBirthDate('');
        setPatientAge('');
        setPatientWeight('');
    }

     function parseByteArray(byteArray) {
            try {
                const dataSet = dicomParser.parseDicom(byteArray);
    
                // 정보 파싱
                const sopInstanceUid = dataSet.string('x0020000d');
                setSopInstanceUid(sopInstanceUid);
    
                const patientId = dataSet.string('x00100020');
                if (patientId !== undefined) {
                    setPatientId(patientId);
                } else {
                    alert("Patient ID element has no data");
                }
    
                const patientName = dataSet.string('x00100010');
                if (patientName !== undefined) {
                    setPatientName(patientName);
                } else {
                    alert("Patient Name element has no data");
                }
    
                const patientSex = dataSet.string('x00100040');
                setPatientSex(patientSex || "N/A");
    
                const patientBirthDate = dataSet.string('x00100030');
                setPatientBirthDate(patientBirthDate || "N/A");
    
                const patientAge = dataSet.string('x00101010');
                setPatientAge(patientAge || "N/A");
    
                const patientWeight = dataSet.string('x00101030');
                setPatientWeight(patientWeight || "N/A");
    
            } catch (err) {
                setParseError(err.message);
            }
        }

    function loadFile(acceptedFiles) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = function () {
            const arrayBuffer = reader.result;
            const byteArray = new Uint8Array(arrayBuffer);
            parseByteArray(byteArray);
        };
        reader.readAsArrayBuffer(file);
    }







    const { loadingState, images } = useMultipleImages({
        // wadouri: IMAGES
        wadouri: dcmFiles

    })

    const { frame, setFrame } = useFrame({
        initial: 0,
        max: images.length - 1,
    })

    function changeFrame(e) {
        const { value } = e.target
        setFrame(Number(value))
    }

    const [annotationsByFrame, setAnnotationsByFrame] = useState({});
    const annotations = annotationsByFrame[frame] || [];

    const handleAnnotationsChange = (newAnnotations) => {
        setAnnotationsByFrame(prev => ({
            ...prev,
            [frame]: newAnnotations,
        }));
    };


    const viewerRef = useRef(null)

    const { viewport, setViewport, resetViewport, initialized } = useViewport({
        image: images[frame] || null,
        viewerRef,
        options: { fitScale: false },
        getInitialViewport: (prevViewport) => ({
            ...prevViewport, ...INITIAL_VIEWPORT1
        }),
    })


    const updateViewport = useCallback(
        (key, value) => {
            setViewport((prev) => ({
                ...prev,
                [key]: value,
            }))
        },
        [setViewport]
    )

    useEffect(() => {
        function handleKeyDown({ code }) {
            if (code === 'KeyS') {
                updateViewport('y', viewport.y + 10)
            }
            if (code === 'KeyW') {
                updateViewport('y', viewport.y - 10)
            }
            if (code === 'KeyD') {
                updateViewport('x', viewport.x + 10)
            }
            if (code === 'KeyA') {
                updateViewport('x', viewport.x - 10)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [setViewport])

    return (
        <div>
            <div className="container mt-5">
                <div className="mb-4">
                    <div className="row mb-3">
                        <div className="col">
                            <div>x transition {viewport.x}</div>
                            <input
                                type="range"
                                id="x"
                                name="x"
                                min="0"
                                max="100"
                                step="10"
                                onChange={(e) => updateViewport("x", Number(e.target.value))}
                                className="form-range"
                                value={viewport?.x ?? 0}
                            />
                        </div>
                        <div className="col">
                            <div>y transition {viewport.y}</div>
                            <input
                                type="range"
                                id="y"
                                name="y"
                                min="0"
                                max="100"
                                step="10"
                                onChange={(e) => updateViewport("y", Number(e.target.value))}
                                className="form-range"
                                value={viewport?.y ?? 0}
                            />
                        </div>
                        <div className="col">
                            <button className="btn btn-primary" onClick={resetViewport}>
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <div>windowWidth {viewport.windowWidth}</div>
                            <input
                                type="range"
                                id="windowWidth"
                                name="windowWidth"
                                min="0"
                                max="300"
                                step="10"
                                onChange={(e) => updateViewport("windowWidth", Number(e.target.value))}
                                className="form-range"
                                value={viewport?.windowWidth ?? 0}
                            />
                        </div>
                        <div className="col">
                            <div>windowCenter {viewport.windowCenter}</div>
                            <input
                                type="range"
                                id="windowCenter"
                                name="windowCenter"
                                min="0"
                                max="300"
                                step="10"
                                onChange={(e) => updateViewport("windowCenter", Number(e.target.value))}
                                className="form-range"
                                value={viewport?.windowCenter ?? 0}
                            />
                        </div>
                        <div className="col">
                            <div>scale {viewport.scale}</div>
                            <input
                                type="range"
                                id="scale"
                                name="scale"
                                min="0.5"
                                max="2"
                                step="0.1"
                                onChange={(e) => updateViewport("scale", Number(e.target.value))}
                                className="form-range"
                                value={viewport?.scale ?? 0}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            invert{" "}
                            <input
                                type="checkbox"
                                onChange={(e) => updateViewport("invert", e.target.checked)}
                                className="form-check-input"
                                checked={viewport.invert}
                            />
                        </div>
                        <div className="col">
                            hflip{" "}
                            <input
                                type="checkbox"
                                onChange={(e) => updateViewport("hflip", e.target.checked)}
                                className="form-check-input"
                                checked={viewport?.hflip ?? false}
                            />
                        </div>
                        <div className="col">
                            vflip{" "}
                            <input
                                type="checkbox"
                                onChange={(e) => updateViewport("vflip", e.target.checked)}
                                className="form-check-input"
                                checked={viewport?.vflip ?? false}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Row className="flex-row">
                <Col>
                    <div
                        className="form-check form-switch form-switch-lg mb-3"
                    >
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="customDrawing"
                            onChange={() => setIsDrawing(!isDrawing)}
                        />
                        <label
                            className="form-check-label"
                            htmlFor="customSwitchsizelg"
                        >
                            Draw enabled
                        </label>
                    </div>
                </Col>

                <Col>
                    <div
                        className="form-check form-switch form-switch-lg mb-3"
                    >
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="customLabel"
                            onChange={() => setLabelShow(!labelShow)}
                        />
                        <label
                            className="form-check-label"
                            htmlFor="customSwitchsizelg"
                        >
                            Show label
                        </label>
                    </div>
                </Col>

                <Col>
                    <button className="btn btn-primary w-md" onClick={() => setAnnotationsByFrame({})}>Reset</button>
                </Col>
            </Row>

            <Row className="mt-4 flex-row">
                <Col>
                    <h5 className="font-size-14 mb-4">Select Annotation mode</h5>
                </Col>
                {annotationData.map((annotation, index) => (
                    <>
                        <Col className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="exampleRadios"
                                id={`exampleRadios${index + 1}`}
                                value={`option${index + 1}`}
                                onChange={() => setAnnotationMode(annotation.value)}
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`exampleRadios${index + 1}`}
                            >
                                {annotation.name}
                            </label>
                        </Col>
                    </>
                ))}

            </Row>

            <div>
                <input
                    type="range"
                    id="frame"
                    name="frame"
                    min="0"
                    max={dcmFiles.length - 1}
                    step="1"
                    onChange={changeFrame}
                    className="frame-control"
                    value={frame}
                />
                <div style={{ width: '80vw', height: '500px' }}>
                    <InsightViewer
                        viewerRef={viewerRef}
                        image={images[frame]}
                        viewport={viewport}
                        onViewportChange={setViewport}
                    >
                        <OverlayLayer viewport={viewport} />
                        {/* <DicomHeader /> */}
                        <AnnotationOverlay
                            isDrawing={isDrawing}
                            mode={annotationMode}
                            annotations={annotations}
                            onChange={handleAnnotationsChange}
                            showAnnotationLabel={labelShow}
                        />
                    </InsightViewer>
                </div>
            </div>
            {/* <DicomHeader/> */}
            <div id="dropZone">
                        <div {...getRootProps()}>
                            <input key="dropzone-input" {...getInputProps()} />
                            {isDragActive ? (
                                <p>Drop the files here ...</p>
                            ) : (
                                <p>Drag and drop some files here, or click to select files</p>
                            )}
                        </div>
                    </div>
        </div>
    );
}


// export declare const AnnotationOverlay: ({

// width, height, className, style, isDrawing, clickAction, mode,
// annotations, showOutline, hoveredAnnotation, selectedAnnotation, showAnnotationLabel,
// onAdd, onHover, onRemove, onSelect, onChange,

// }: AnnotationOverlayProps) => React.JSX.Element | null;

