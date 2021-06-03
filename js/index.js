import "https://cdn.jsdelivr.net/npm/ionicons/dist/ionicons/ionicons.esm.js"
import PopulationManger from "./libs/evolution/PopulationManager.js"

import { resolution, load, fit } from "./libs/canvas.js"
import { modalComponent } from "./components/modal.js"
import { inputComponent } from "./components/input.js"
import { h, $ } from "./utils.js"

const main = (async (STATE) => {
    const [sourceCanvas, resultCanvas] = $("canvas")
    const settingsButton = $("#settings")[0]
    const evolveButton = $("#evolve")[0]

    const dimensions = {
        width: sourceCanvas.offsetWidth * STATE.RESOLUTION_FACTOR,
        height: sourceCanvas.offsetWidth * STATE.RESOLUTION_FACTOR
    }
    
    resolution(sourceCanvas, dimensions, STATE.RESOLUTION_FACTOR)
    resolution(resultCanvas, dimensions, STATE.RESOLUTION_FACTOR)

    const image = await load(STATE.SOURCE_PATH)
    fit(sourceCanvas, image, STATE.RESOLUTION_FACTOR)

    const populationManager = new PopulationManger({ dimensions, polygonCount: 100 })
    const sourceCtx = sourceCanvas.getContext("2d")
    const source = sourceCtx.getImageData(0, 0, dimensions.width, dimensions.height)

    const resultCtx = resultCanvas.getContext("2d")

    settingsButton.addEventListener("click", () => {
        document.body.appendChild(modalComponent("Settings",
            h("p", {}, "Warning: changing settings will reset evolution"),
            h("input", { placeholder: STATE.SOURCE_PATH, value: STATE.SOURCE_PATH }),
            inputComponent("# of Polygons", { min: 50, max: 100, value: 50, name: "polygons" }),
            inputComponent("# of Vertices", { min: 50, max: 100, value: 50, name: "vertices" }),
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
})

const INITIAL_STATE = {
    SOURCE_PATH: "/js/libs/evolution/mona-lisa.jpg",
    RESOLUTION_FACTOR: 3,
    EV_ID: 0 
}

const STATE = new Proxy(INITIAL_STATE, {
    set: (obj, key, value) => {
        obj[key] = value

        if(key !== "EV_ID") {
            main(STATE)
        }

        return true
    }
})

main(STATE)