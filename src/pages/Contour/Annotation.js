import React, { useCallback, useEffect, useRef, useState } from 'react';
import InsightViewer, { useFrame, useImage, useMultipleImages } from '@lunit/insight-viewer';
import { AnnotationOverlay } from '@lunit/insight-viewer/annotation';
import { Col, Row } from 'reactstrap';
import { useViewport } from '@lunit/insight-viewer/viewport'
import OverlayLayer from './OverlayLayer';

const INITIAL_VIEWPORT1 = {
    scale: 0.5,
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
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.724.1165.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YWNH599TLSBE4OK0J0B1%2F20250203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250203T123338Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJZV05INTk5VExTQkU0T0swSjBCMSIsImV4cCI6MTczODYyNjQxOSwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.ectZUsYuK-YvvdPSh7FTPKBbzIhIoXOPAJ5DYEtJTsLmU2TouzOxgUZVzoW-4cA8dnZA815ccYdqQHbfpIX1Qg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=e5ecbee27e84278fe03ed7c475a39589b9bf11fc3ae132fade4939b573ebf0cc",

    "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.734.1170.dcm",
    "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.724.1165.dcm",
    "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.728.1168.dcm",
    "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.731.1169.dcm",
    "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.734.1170.dcm",
    "wadouri:/images/2.16.840.1.114362.1.11890052.23347336132.553945887.736.1171.dcm",
];

export default function Annotation() {
    const [annotations, setAnnotations] = useState([]);


    // 싱글
    // const { loadingState, image } = useImage({
    //     wadouri: IMAGES[0],
    // });

    // const { frame, setFrame } = useFrame({
    //     initial: 0,
    //     max: IMAGES.length - 1,
    // })

    const handleAnnotationsChange = (annotations) => {
        setAnnotations(annotations);
    };


    // 멀티
    const { loadingState, images } = useMultipleImages({
        wadouri: IMAGES
    })

    const { frame, setFrame } = useFrame({
        initial: 0,
        max: images.length - 1,
    })

    function changeFrame(e) {
        const { value } = e.target
        setFrame(Number(value))
    }

    const [isDrawing, setIsDrawing] = useState(false)
    const [labelShow, setLabelShow] = useState(false)
    const [annotationMode, setAnnotationMode] = useState('polygon')

    console.log('asdfasdfasdfasdf', images);


    const viewerRef = useRef(null)


    const { viewport, setViewport, resetViewport, initialized } = useViewport({
        // image,
        images,
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

    // update viewport with keyboard event
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

            <Row>
                <Col>
                    <div
                        className="form-check form-switch form-switch-lg mb-3"
                    >
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="customSwitchsizelg"
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
            </Row>

            <Row>
                <Col>
                    <div
                        className="form-check form-switch form-switch-lg mb-3"
                    >
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="customSwitchsizelg"
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
            </Row>

            <Row>
                <Col>
                    <button onClick={() => setAnnotations([])}>Reset</button>
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
                    max={IMAGES.length - 1}
                    step="1"
                    onChange={changeFrame}
                    className="frame-control"
                    value={frame}
                />
                <div style={{ width: '80vw', height: '500px' }}>
                    {/* <InsightViewer
                        viewerRef={viewerRef}
                        // image={image}
                        image={images[frame]}
                        viewport={viewport}
                        onViewportChange={setViewport}
                    > */}
                    <InsightViewer image={images[frame]} >
                        {/* <OverlayLayer viewport={viewport} /> */}
                        {loadingState === 'success' && (
                        <AnnotationOverlay
                            isDrawing={isDrawing}
                            mode={annotationMode}
                            annotations={annotations}
                            // onChange={handleAnnotationsChange}
                            showAnnotationLabel={labelShow}
                        />
                        )} 
                   </InsightViewer>
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

