import "https://cdn.jsdelivr.net/npm/ionicons/dist/ionicons/ionicons.esm.js"
import PopulationManger from "./libs/evolution/PopulationManager.js"

import { resolution, load, fit } from "./libs/canvas.js"
import { h, $ } from "./utils.js"

let SOURCE_PATH = "/js/libs/evolution/mona-lisa.jpg"
let EV_ID = 0

const main = (async () => {
    const [sourceCanvas, resultCanvas] = $("canvas")
    const statistics = $("#statistics")[0]
    // const fitnessSpan = $("#fitness")[0]

    const dimensions = {
        width: sourceCanvas.offsetWidth,
        height: sourceCanvas.offsetWidth
    }
    
    resolution(sourceCanvas, dimensions)
    resolution(resultCanvas, dimensions)

    const image = await load(SOURCE_PATH)
    fit(image, sourceCanvas)

    const populationManager = new PopulationManger({ dimensions, polygonCount: 100 })
    const sourceCtx = sourceCanvas.getContext("2d")
    const source = sourceCtx.getImageData(0, 0, dimensions.width, dimensions.height)

    const resultCtx = resultCanvas.getContext("2d")

    EV_ID = setInterval(() => {
        populationManager.core(resultCtx, source)
        statistics.textContent = `mutations: ${populationManager.mutations}, improvements: ${populationManager.improvements}, fitness: ${populationManager.normalizedFitness.toFixed(2)}%`
    }, 0)
})()

