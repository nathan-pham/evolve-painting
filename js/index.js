import "https://cdn.jsdelivr.net/npm/ionicons/dist/ionicons/ionicons.esm.js"
import * as evolution from "./libs/evolution.js"
import * as canvas from "./libs/canvas.js"
import animate from "./libs/animate.js"
import { h, $ } from "./utils.js"

const path = "https://alteredqualia.com/visualization/evolve/mona_lisa_crop.jpg"

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

    const population = evolution.population(dimensions)
    const ctx = resultCanvas.getContext("2d")

    population.render(ctx)
})()

