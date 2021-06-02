import "https://cdn.jsdelivr.net/npm/ionicons/dist/ionicons/ionicons.esm.js"
import * as canvas from "./canvas.js"
import { h, $ } from "./utils.js"

const [sourceCanvas, resultCanvas] = $("canvas")

const dimensions = {
    width: sourceCanvas.offsetWidth,
    height: sourceCanvas.offsetWidth
}

canvas.resolution(sourceCanvas, dimensions)
canvas.resolution(resultCanvas, dimensions)