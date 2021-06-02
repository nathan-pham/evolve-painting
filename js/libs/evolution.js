import { random } from "./math.js"

export const polygon = (dimensions, verticeCount) => {
    const color = `rgba(${random(255)}, ${random(255)}, ${random(255)}, ${random(1)})`
    const vertices = []

    for(let i = 0; i < verticeCount; i++) {
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

export const population = (dimensions, polygonCount, verticeCount) => {
    const polygons = []

    for(let i = 0; i < polygonCount; i++) {
        polygons.push(polygon(dimensions, verticeCount))
    }

    const render = (ctx) => {
        for(const polygon of polygons) {
            polygon.render(ctx)
        }
    }

    const calculateFitness = (sourceData, resultData) => {
        let diff = 0
 
        for (let i = 0; i < sourceData.data.length / 4; i++) {
            diff += Math.abs(sourceData.data[4 * i + 0] - resultData.data[4 * i + 0]) / 255;
            diff += Math.abs(sourceData.data[4 * i + 1] - resultData.data[4 * i + 1]) / 255;
            diff += Math.abs(sourceData.data[4 * i + 2] - resultData.data[4 * i + 2]) / 255;
        }

        return 100 * diff / (sourceData.width * sourceData.height * 3)
    }

    return {
        render,
        calculateFitness
    }
}

export const manager = (dimensions, polygonCount=100, populationCount=100, verticeCount=4, mutationChance=0.05) => {
    const populations = []

    for(let i = 0; i < populationCount; i++) {
        populations.push(population(dimensions, polygonCount, verticeCount))
    }

    const render = (ctx, sourceData, resultData) => {
        let totalFitness = 0
        let bestPopulation

        for(const population of populations) {
            const fitness = population.calculateFitness()
            totalFitness += 
        }
    }

    return {
        render
    }
}