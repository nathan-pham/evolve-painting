import Population from "./Population.js"

export default class PopulationManager {
    mutationMode = 0.05
    verticeCount = 4
    dimensions = {}

    mutations = 0
    improvements = 0
    normalizedFitness = 0

    bestFitness = Infinity
    bestPopulation = {}

    constructor({ dimensions, polygonCount=50, verticeCount=6, mutationMode="medium", dnaMode="black" }) {
        this.mutationMode = mutationMode
        this.dimensions = dimensions
        this.population = new Population(dimensions, polygonCount, verticeCount, dnaMode)
    }

    core(ctx, source) {
        this.population.mutate(this.mutationMode)
        this.mutations++

        this.population.fitness = this.population.calculateFitness(source)

        const NORM_COEF = this.dimensions.width * this.dimensions.height * 3 * 255

        if(this.population.fitness < this.bestFitness) {
            this.bestFitness = this.population.fitness
            this.bestPopulation = this.population.clone()
            this.improvements++
            this.normalizedFitness = 100 * (1 - this.bestFitness / NORM_COEF)
            this.bestPopulation.render(ctx)
        } else {
            this.population = this.bestPopulation.clone()
        }
    }
}