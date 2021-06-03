import "https://cdn.jsdelivr.net/npm/ionicons/dist/ionicons/ionicons.esm.js"
import PopulationManger from "./libs/evolution/PopulationManager.js"
import * as canvas from "./libs/canvas.js"
import { h, $ } from "./utils.js"
import animate from "./libs/animate.js"

const path = "/js/libs/evolution/mona-lisa.jpg"

const main = (async () => {
    const [sourceCanvas, resultCanvas] = $("canvas")

    const dimensions = {
        width: sourceCanvas.offsetWidth,
        height: sourceCanvas.offsetWidth
    }
    
    canvas.resolution(sourceCanvas, dimensions)
    canvas.resolution(resultCanvas, dimensions)

    const image = await canvas.load(path)
    canvas.fit(image, sourceCanvas)

    const populationManager = new PopulationManger({ dimensions, verticeCount: 3 })
    const sourceCtx = sourceCanvas.getContext("2d")
    const resultCtx = resultCanvas.getContext("2d")

    populationManager.render(resultCtx, sourceCtx)

    // animate(() => {
    //     // populationManager
    // })
})()

