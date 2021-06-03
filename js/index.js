import "https://cdn.jsdelivr.net/npm/ionicons/dist/ionicons/ionicons.esm.js"
import PopulationManger from "./libs/evolution/PopulationManager.js"

import { resolution, load, fit } from "./libs/canvas.js"
import { modalComponent } from "./components/modal.js"
import { h, $ } from "./utils.js"

let STATE = {
    SOURCE_PATH: "/js/libs/evolution/mona-lisa.jpg",
    EV_ID: 0 
}

const main = (async () => {
    const [sourceCanvas, resultCanvas] = $("canvas")
    const settingsButton = $("#settings")[0]
    const evolveButton = $("#evolve")[0]
    // const statistics = $("#statistics")[0]
    // const fitnessSpan = $("#fitness")[0]

    const dimensions = {
        width: sourceCanvas.offsetWidth,
        height: sourceCanvas.offsetWidth
    }
    
    resolution(sourceCanvas, dimensions)
    resolution(resultCanvas, dimensions)

    const image = await load(STATE.SOURCE_PATH)
    fit(image, sourceCanvas)

    const populationManager = new PopulationManger({ dimensions, polygonCount: 100 })
    const sourceCtx = sourceCanvas.getContext("2d")
    const source = sourceCtx.getImageData(0, 0, dimensions.width, dimensions.height)

    const resultCtx = resultCanvas.getContext("2d")

    settingsButton.addEventListener("click", () => {
        document.body.appendChild(modalComponent("Settings",
            h("p", {}, "Warning: changing settings will reset evolution"),
            h("input", { placeholder: STATE.SOURCE_PATH, value: STATE.SOURCE_PATH }),
            h("div", {}, 
                h("input", { type: "range", min: 50, max: 100, value: 50, name: "polygons", id: "polygons" }),
                h("label", { for: "polygons" }, "# of Polygons")
            ),
            h("div", {},
                h("input", { type: "range", min: 50, max: 100, value: 50, name: "vertices", id: "vertices" }),
                h("label", { for: "vertices" }, "# of Vertices")
            ),
            h("button", {}, "Save")
        ))
    })

    /*
  <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
    */

    evolveButton.addEventListener("click", () => {
        if(evolveButton.textContent.toLowerCase().includes("start")) {
            STATE.EV_ID = setInterval(() => {
                populationManager.core(resultCtx, source)
                // statistics.textContent = `mutations: ${populationManager.mutations}, improvements: ${populationManager.improvements}, fitness: ${populationManager.normalizedFitness.toFixed(2)}%`
            }, 0)
            
            evolveButton.textContent = "Stop Evolving"
        } else {
            clearInterval(STATE.EV_ID)
            evolveButton.textContent = "Start Evolving"
        }
    })
})()

