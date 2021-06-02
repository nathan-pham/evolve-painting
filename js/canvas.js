export const resolution = (canvas, dimensions) => {
    Object.assign(canvas, dimensions)
    Object.assign(canvas.style, Object.keys(dimensions).reduce((acc, cur) => ({
        ...acc,
        [cur]: dimensions[cur] + "px"
    }), {}))
}