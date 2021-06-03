import "https://cdn.jsdelivr.net/npm/ionicons/dist/ionicons/ionicons.esm.js"
import PopulationManger from "./libs/evolution/PopulationManager.js"
import animate from "./libs/animate.js"

import { resolution, load, fit } from "./libs/canvas.js"
import { h, $ } from "./utils.js"

const path = "/js/libs/evolution/mona-lisa.jpg"

const main = (async () => {
    const [sourceCanvas, resultCanvas] = $("canvas")

    const dimensions = {
        width: sourceCanvas.offsetWidth,
        height: sourceCanvas.offsetWidth
    }
    
    resolution(sourceCanvas, dimensions)
    resolution(resultCanvas, dimensions)

    const image = await load(path)
    fit(image, sourceCanvas)

    const populationManager = new PopulationManger({ dimensions, verticeCount: 3 })
    const sourceCtx = sourceCanvas.getContext("2d")
    const resultCtx = resultCanvas.getContext("2d")

    populationManager.render(resultCtx, sourceCtx)

    // animate(() => {
    //     // populationManager
    // })
})()

