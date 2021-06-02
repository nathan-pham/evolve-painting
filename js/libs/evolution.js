import { random } from "./math.js"

export const polygon = (vertices) => {
    const color = `rgba(${random(255)}, ${random(255)}, ${random(255)}, ${random(1)})`

    const render = (ctx) => {

    }

    return {
        render
    }
}

export const population = (polygonCount=100, verticeCount=3, mutationChance=0.05) => {
    const polygons = []
    
    for(const i = 0; i < polygonCount; i++) {
        polygons.push(polygon(verticeCount))
    }

    const render = () => {
        for(const polygon of polygons) {
            polygon.render()
        }
    }

    return {
        render
    }
}