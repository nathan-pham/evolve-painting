import "https://cdn.jsdelivr.net/npm/ionicons/dist/ionicons/ionicons.esm.js"
import PopulationManger from "./libs/evolution/PopulationManager.js"

import { resolution, load, fit } from "./libs/canvas.js"
import { modalComponent } from "./components/modal.js"
import { inputComponent } from "./components/input.js"
import { h, $ } from "./utils.js"

const DEFAULT_SOURCE_PATH = "/js/libs/evolution/mona-lisa.jpg"

let GLOBAL_STATE = {
    SOURCE_PATH: DEFAULT_SOURCE_PATH,
    RESOLUTION_FACTOR: 3,
    POLYGON_COUNT: 50,
    VERTICE_COUNT: 6,
    EV_ID: 0
}

const main = async () => {
    const [sourceCanvas, resultCanvas] = $("canvas")
    const settingsButton = $("#settings")[0]
    const evolveButton = $("#evolve")[0]

    const dimensions = {
        width: sourceCanvas.offsetWidth * GLOBAL_STATE.RESOLUTION_FACTOR,
        height: sourceCanvas.offsetWidth * GLOBAL_STATE.RESOLUTION_FACTOR
    }
    resolution(sourceCanvas, dimensions, GLOBAL_STATE.RESOLUTION_FACTOR)
    resolution(resultCanvas, dimensions, GLOBAL_STATE.RESOLUTION_FACTOR)

    const image = await load(GLOBAL_STATE.SOURCE_PATH)
    fit(sourceCanvas, image, GLOBAL_STATE.RESOLUTION_FACTOR)

    let populationManager = new PopulationManger({ 
        dimensions, 
        polygonCount: GLOBAL_STATE.POLYGON_COUNT, 
        verticeCount: GLOBAL_STATE.VERTICE_COUNT 
    })

    const sourceCtx = sourceCanvas.getContext("2d")
    const resultCtx = resultCanvas.getContext("2d")
    const source = sourceCtx.getImageData(0, 0, dimensions.width, dimensions.height)

    let modal

    settingsButton.onclick = () => {
        modal = modalComponent("Settings",
            h("p", {}, `Changing settings will reset evolution.`),
            h("p", { id: "statistics" }, "Start evolution to see statistics."),
            h("input", { placeholder: DEFAULT_SOURCE_PATH, value: GLOBAL_STATE.SOURCE_PATH, type: "text" }),
            
            inputComponent(`${GLOBAL_STATE.POLYGON_COUNT}/1000 Polygons`, { min: 10, max: 1000, value: GLOBAL_STATE.POLYGON_COUNT, name: "polygons", onChange: (e) => e.target.parentNode.querySelector("label").textContent = `${e.target.value}/1000 Polygons`}),

            inputComponent(`${GLOBAL_STATE.VERTICE_COUNT}/100 Vertices`, { min: 3, max: 100,  value: GLOBAL_STATE.VERTICE_COUNT, name: "vertices", onChange: (e) => e.target.parentNode.querySelector("label").textContent = `${e.target.value}/100 Vertices` }),
            
            h("div", { className: "options" },
                h("button", { className: "secondary" }, "Download Image"),
                h("button", { onClick: () => {
                    const [path, polygons, vertices] = modal.querySelectorAll("input")
                    GLOBAL_STATE = {
                        ...GLOBAL_STATE,
                        SOURCE_PATH: path.value,
                        POLYGON_COUNT: parseInt(polygons.value),
                        VERTICE_COUNT: parseInt(vertices.value),
                    }
                    
                    populationManager = new PopulationManger({ 
                        dimensions, 
                        polygonCount: GLOBAL_STATE.POLYGON_COUNT, 
                        verticeCount: GLOBAL_STATE.VERTICE_COUNT 
                    })

                    if(evolveButton.textContent.toLowerCase().includes("start")) {
                        clearInterval(GLOBAL_STATE.EV_ID)
                    }
                    
                    modal.remove()
                    modal = null
                }}, "Save Settings"),
            )
        )

        document.body.appendChild(modal)
    }

    evolveButton.onclick = () => {
        if(evolveButton.textContent.toLowerCase().includes("start")) {
            evolveButton.textContent = "Stop Evolving"
            GLOBAL_STATE.EV_ID = setInterval(() => {
                populationManager.core(resultCtx, source)

                if(modal && document.body.contains(modal)) {
                    document.getElementById("statistics").textContent = `mutations: ${populationManager.mutations}, improvements: ${populationManager.improvements}, fitness: ${populationManager.normalizedFitness.toFixed(2)}%`
                }
            }, 0)
        } else {
            evolveButton.textContent = "Start Evolving"
            clearInterval(GLOBAL_STATE.EV_ID)
        }
    }
}

main()