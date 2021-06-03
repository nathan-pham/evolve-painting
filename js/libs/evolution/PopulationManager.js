import Population from "./Population.js"
import { random } from "../math.js"

export default class PopulationManager {
    mutationMode = 0.05
    verticeCount = 4
    dimensions = {}

    mutations = 0
    improvements = 0
    // fitnessPercent = 0

    constructor({ dimensions, polygonCount=50, verticeCount=6, mutationMode="medium", dnaMode="black" }) {
        this.mutationMode = mutationMode
        this.verticeCount = verticeCount
        this.dimensions = dimensions
        this.dnaMode = dnaMode

        this.population = new Population(dimensions, polygonCount, verticeCount, dnaMode)
    }

    core(resultCtx, source) {
        this.mutations++
        this.population.calculateFitness(source)

        let child = this.population.clone()
        child.mutate(this.mutationMode)
        child.calculateFitness(source)

        if(child.fitness > this.population.fitness) {
            this.improvements++
            this.population = child
        }

        resultCtx.fillStyle = "rgb(255, 255, 255)"
        resultCtx.fillRect(0, 0, this.dimensions.width, this.dimensions.height)

        this.population.render(resultCtx)
    }
}