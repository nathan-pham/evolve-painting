import { h } from "../utils.js"

export const resolution = (canvas, dimensions, RESOLUTION_FACTOR) => {
    const reduce = (obj, alter) => (
        Object.keys(obj).reduce((acc, cur) => ({
            ...acc,
            [cur]: alter(obj[cur]) // + "px"
        }), {})
    )

    const scale = window.devicePixelRatio || 1
    const ctx = canvas.getContext("2d")

    Object.assign(canvas, reduce(dimensions, (cur) => Math.floor(cur * scale)))
    Object.assign(canvas.style, reduce(dimensions, (cur) => cur / RESOLUTION_FACTOR + "px"))
    ctx.scale(scale, scale)
}

export const load = async (path) => (
    new Promise((resolve, reject) => {
        const img = new Image()

        img.crossOrigin = "Anonymous"
        img.onload = () => resolve(img)
        img.onerror = async () => {
            console.log("failed to load image, using mona lisa instead")
            resolve(await load("/js/libs/evolution/mona-lisa.jpg"))
        }
        img.src = path
    })
)

export const fit = (canvas, image, RESOLUTION_FACTOR) => {
    const ctx = canvas.getContext("2d")
    const ratio = image.width / image.height
    
    const canvasWidth = parseInt(canvas.style.width) * RESOLUTION_FACTOR
    const canvasHeight = parseInt(canvas.style.height) * RESOLUTION_FACTOR

    let newWidth = canvasWidth
    let newHeight = newWidth / ratio

    if (newHeight < canvasHeight) {
        newHeight = canvasHeight
        newWidth = newHeight * ratio
    }

    const xOffset = newWidth > canvasWidth ? (canvasWidth - newWidth) / 2 : 0
    const yOffset = newHeight > canvasHeight ? (canvasHeight - newHeight) / 2 : 0

    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight)
}

export const download = (canvas) => {
    h("a", { style: "display: none", download: "image-evolution.png", href: canvas.toDataURL("image/png") }).click()
}