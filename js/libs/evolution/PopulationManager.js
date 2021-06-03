import { resolution } from "../canvas.js"
import Population from "./Population.js"

export default class PopulationManager {
    generation = 0
    dimensions = {}
    populations = []

    constructor({ dimensions, populationCount=100, polygonCount=100, verticeCount=4, mutationChance=0.05 }) {
        this.dimensions = dimensions

        for(let i = 0; i < populationCount; i++) {
            this.populations.push(new Population(dimensions, polygonCount, verticeCount))
        }
    }

    createCanvas() {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        resolution(canvas, this.dimensions)

        return [canvas, ctx]
    }

    calculateFitness(sourceCtx) {
        const source = sourceCtx.getImageData(0, 0, this.dimensions.width, this.dimensions.height)

        let totalFitness = 0
        let bestPopulation = this.populations[0]

        for(const population of this.populations) {
            const [_, resultCtx] = this.createCanvas()
            population.render(resultCtx)
            const result = resultCtx.getImageData(0, 0, this.dimensions.width, this.dimensions.height)

            population.calculateFitness(source, result)
            totalFitness += population.fitness
                
            if(population.fitness > bestPopulation.fitness) {
                bestPopulation = population
            }
        }

        for(const population of this.populations) {
            population.fitness /= totalFitness
        }

        return bestPopulation
    }

    render(resultCtx, sourceCtx) {
        const bestPopulation = this.calculateFitness(sourceCtx)
        bestPopulation.render(resultCtx)
    }
}