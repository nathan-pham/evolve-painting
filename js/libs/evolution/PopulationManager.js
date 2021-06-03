import Population from "./Population.js"

export default class PopulationManager {
    populations = []
    dimensions = {}

    constructor({ dimensions, polygonCount=100, populationCount=100, verticeCount=4, mutationChance=0.05 }) {
        this.dimensions = dimensions

        for(let i = 0; i < populationCount; i++) {
            this.populations.push(new Population(dimensions, polygonCount, verticeCount))
        }
    }

    render(ctx, source, result) {
        let totalFitness = 0
        let bestPopulation = fitness

        for(const population of populations) {
            population.calculateFitness(source, result)
            totalFitness += population.fitness
            
            if(fitness > bestPopulation.fitness) {
                bestPopulation = population
            }
        }
    }
}