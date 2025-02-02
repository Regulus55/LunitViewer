import React from 'react'
import { useRef, useEffect, useCallback } from 'react'
import InsightViewer, { useImage } from '@lunit/insight-viewer'
import { useViewport } from '@lunit/insight-viewer/viewport'
import OverlayLayer from './OverlayLayer';

const IMAGES = [
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.947.1240.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013534Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=25a54cd6e1d56969d19116d3adb187055c0bf1aeb7bd3580cfe63ba34a58cf04",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.724.1165.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013012Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=504f9f534e77190f520b6924446c5a99a405dd4c4db93e6700ad782ce39cbff1",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.947.1240.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013534Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=25a54cd6e1d56969d19116d3adb187055c0bf1aeb7bd3580cfe63ba34a58cf04",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.947.1240.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013534Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=25a54cd6e1d56969d19116d3adb187055c0bf1aeb7bd3580cfe63ba34a58cf04",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.736.1171.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013725Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=583b825fc55d639a1d8543d6c03ff0a53466e9305317df9a470353a2aac97c46",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.736.1171.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013725Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=583b825fc55d639a1d8543d6c03ff0a53466e9305317df9a470353a2aac97c46",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.736.1171.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013725Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=583b825fc55d639a1d8543d6c03ff0a53466e9305317df9a470353a2aac97c46",
    "wadouri:http://localhost:9000/beecouple/2.16.840.1.114362.1.11890052.23347336132.553945887.746.1175.dcm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4UFKBM4KJLLC0CV501NV%2F20250202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250202T013800Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0VUZLQk00S0pMTEMwQ1Y1MDFOViIsImV4cCI6MTczODUwMjg3MCwicGFyZW50IjoiYmVlY291cGxlX3VzZXIifQ.bke1pIreNyYS29i2Fg-Y-qiaHI4mzpQ6lj8wcCjAINelUVW0oZGfZhRggnBEMomYnkgCz7s__9ws_b2eeD848Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=fe13f396e32fa73b1e9f58943c680d45b1518bfac2576545b1f3b9e4d5aa3d5d",
];
const style = {
    width: '500px',
    height: '500px'
}
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

export default function App() {
    const viewerRef = useRef(null)

    const { loadingState, image } = useImage({
        wadouri: IMAGES[0],
    })

    const { viewport, setViewport, resetViewport, initialized } = useViewport({
        image,
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

            <div style={style}>
                <InsightViewer
                    viewerRef={viewerRef}
                    image={image}
                    viewport={viewport}
                    onViewportChange={setViewport}
                >
                    <OverlayLayer viewport={viewport} />
                </InsightViewer>
            </div>
        </div>
    )
}
