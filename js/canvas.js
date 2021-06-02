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