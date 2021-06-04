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

export const download = (realSize, polygons) => {
    let targetSize = 1024
    let scale = targetSize / realSize

    const canvas = h("canvas", { width: targetSize, height: targetSize })
    const ctx = canvas.getContext("2d")

    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.fillRect(0, 0, targetSize, targetSize)

    for(const polygon of polygons) {
        ctx.fillStyle = `rgba(${polygon.color.r}, ${polygon.color.g}, ${polygon.color.b}, ${polygon.color.a})`
        ctx.beginPath()

        const [genesisX, genesisY] = polygon.vertices[0]
        ctx.moveTo(genesisX * scale, genesisY * scale)
        for(const vertice of polygon.vertices.slice(1)) {
            ctx.lineTo(vertice[0] * scale, vertice[1] * scale)
        }
        
        ctx.closePath()
        ctx.fill()
    }

    h("a", { style: "display: none", download: "image-evolution.png", href: canvas.toDataURL("image/png") }).click()
}