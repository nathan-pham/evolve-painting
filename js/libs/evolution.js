import { random } from "./math.js"

export const polygon = (dimensions, verticeCount) => {
    const color = `rgba(${random(255)}, ${random(255)}, ${random(255)}, ${random(1)})`
    const vertices = []

    for(const i = 0; i < verticeCount; i++) {
        vertices.push([random(dimensions.width), random(dimensions.height)])
    }

    const render = (ctx) => {
        ctx.fillStyle = color
        ctx.beginPath()

        const [genesisX, genesisY] = vertices[0]
        ctx.moveTo(genesisX, genesisY)
        for(const vertice of vertices.slice(1)) {
            ctx.lineTo(vertice[0], vertice[1])
        }
        
        ctx.closePath()
        ctx.fill()
    }

    return {
        render
    }
}

export const population = (dimensions, polygonCount=100, verticeCount=3, mutationChance=0.05) => {
    const polygons = []
    
    for(const i = 0; i < polygonCount; i++) {
        polygons.push(polygon(dimensions, verticeCount))
    }

    const render = (ctx) => {
        for(const polygon of polygons) {
            polygon.render(ctx)
        }
    }

    return {
        render
    }
}