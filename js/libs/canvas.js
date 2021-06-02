export const resolution = (canvas, dimensions) => {
    Object.assign(canvas, dimensions)
    Object.assign(canvas.style, Object.keys(dimensions).reduce((acc, cur) => ({
        ...acc,
        [cur]: dimensions[cur] + "px"
    }), {}))
}

export const load = async (path) => (
    new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
            resolve(img)
        }

        img.onerror = () => {
            reject("failed to load image")
        }

        img.src = path
    })
)

export const fit = (image, canvas) => {
    const ctx = canvas.getContext("2d")
    const ratio = image.width / image.height
    
    let newWidth = canvas.width
    let newHeight = newWidth / ratio

    if (newHeight < canvas.height) {
        newHeight = canvas.height
        newWidth = newHeight * ratio
    }

    const xOffset = newWidth > canvas.width ? (canvas.width - newWidth) / 2 : 0
    const yOffset = newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0

    ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);
}