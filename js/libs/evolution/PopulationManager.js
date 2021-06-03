import Population from "./Population.js"

export default class PopulationManager {
    dimensions = {}
    populations = []

    constructor({ dimensions, populationCount=100, polygonCount=100, verticeCount=4, mutationChance=0.05 }) {
        this.dimensions = dimensions

        for(let i = 0; i < populationCount; i++) {
            this.populations.push(new Population(dimensions, polygonCount, verticeCount))
        }
    }

    calculateFitness(sourceCtx, resultCtx) {
        const source = sourceCtx.getImageData(0, 0, dimensions.width, dimensions.height)
        const result = resultCtx.getImageData(0, 0, dimensions.width, dimensions.height)

        let totalFitness = 0
        let bestPopulation = population

        for(const population of this.populations) {
            population.calculateFitness(source, result)
            totalFitness += population.fitness
                
            if(fitness > bestPopulation.fitness) {
                bestPopulation = population
            }
        }
    }

    render(ctx) {

        // this.population.render(ctx)
    }
}