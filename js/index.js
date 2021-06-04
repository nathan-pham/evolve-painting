import "https://cdn.jsdelivr.net/npm/ionicons/dist/ionicons/ionicons.esm.js"
import PopulationManger from "./libs/evolution/PopulationManager.js"

import { resolution, download, load, fit } from "./libs/canvas.js"
import { modalComponent } from "./components/modal.js"
import { inputComponent } from "./components/input.js"
import { h, $ } from "./utils.js"

let GLOBAL_STATE = {
    SOURCE_PATH: "/js/libs/evolution/mona-lisa.jpg",
    POLYGON_COUNT: 100,
    VERTICE_COUNT: 6,
    EV_ID: 0
}

const main = async () => {
    const [sourceCanvas, resultCanvas] = $("canvas")
    const settingsButton = $("#settings")[0]
    const evolveButton = $("#evolve")[0]

    const dimensions = {
        width: sourceCanvas.offsetWidth,
        height: sourceCanvas.offsetWidth
    }
    resolution(sourceCanvas, dimensions)
    resolution(resultCanvas, dimensions)

    fit(sourceCanvas, await load(GLOBAL_STATE.SOURCE_PATH))

    let populationManager = new PopulationManger({ 
        dimensions, 
        polygonCount: GLOBAL_STATE.POLYGON_COUNT, 
        verticeCount: GLOBAL_STATE.VERTICE_COUNT 
    })

    const sourceCtx = sourceCanvas.getContext("2d")
    const resultCtx = resultCanvas.getContext("2d")

    let source = sourceCtx.getImageData(0, 0, dimensions.width, dimensions.height)
    let statistics = "Start evolution to see statistics."
    let modal

    settingsButton.onclick = () => {
        modal = modalComponent("Settings",
            h("p", {}, `Changing settings will reset evolution.`),
            h("p", { id: "statistics" }, statistics),
            h("input", { placeholder: "/js/libs/evolution/mona-lisa.jpg", value: GLOBAL_STATE.SOURCE_PATH, type: "text" }),
            
            inputComponent(`${GLOBAL_STATE.POLYGON_COUNT}/1000 Polygons`, { min: 10, max: 1000, value: GLOBAL_STATE.POLYGON_COUNT, name: "polygons", onChange: (e) => e.target.parentNode.querySelector("label").textContent = `${e.target.value}/1000 Polygons`}),

            inputComponent(`${GLOBAL_STATE.VERTICE_COUNT}/100 Vertices`, { min: 3, max: 100,  value: GLOBAL_STATE.VERTICE_COUNT, name: "vertices", onChange: (e) => e.target.parentNode.querySelector("label").textContent = `${e.target.value}/100 Vertices` }),
            
            h("div", { className: "options" },
                h("button", { className: "secondary", onClick: () => {
                    download(dimensions.width, populationManager.bestPopulation.polygons)
                }}, "Download Image"),
                h("button", { onClick: async () => {
                    const [path, polygons, vertices] = modal.querySelectorAll("input")
                    const NEW_SOURCE_PATH = path.value

                    if(NEW_SOURCE_PATH !== GLOBAL_STATE.SOURCE_PATH) {
                        fit(sourceCanvas, await load(NEW_SOURCE_PATH))
                        source = sourceCtx.getImageData(0, 0, dimensions.width, dimensions.height)
                        statistics = "Start evolution to see statistics."
                    }

                    GLOBAL_STATE = {
                        ...GLOBAL_STATE,
                        SOURCE_PATH: NEW_SOURCE_PATH,
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

                    modal.querySelector(".icon").click()
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
                    statistics = `mutations: ${populationManager.mutations}, improvements: ${populationManager.improvements}, fitness: ${populationManager.normalizedFitness.toFixed(2)}%`
                    document.getElementById("statistics").textContent = statistics
                }
            }, 0)
        } else {
            evolveButton.textContent = "Start Evolving"
            clearInterval(GLOBAL_STATE.EV_ID)
        }
    }
}

main()