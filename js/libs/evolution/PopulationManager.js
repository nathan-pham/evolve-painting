import Population from "./Population.js"
import { random } from "../math.js"

export default class PopulationManager {
    mutationMode = 0.05
    verticeCount = 4
    dimensions = {}

    generation = 0
    // fitnessPercent = 0

    constructor({ dimensions, polygonCount=50, verticeCount=6, mutationMode="medium", dnaMode="black" }) {
        this.mutationMode = mutationMode
        this.verticeCount = verticeCount
        this.dimensions = dimensions
        this.dnaMode = dnaMode

        this.population = new Population(dimensions, polygonCount, verticeCount, dnaMode)
    }

    core(resultCtx, source) {
        this.generation++
        this.population.calculateFitness(source)

        let child = new Population(this.dimensions, this.population.polygons)
        child.mutate(this.mutationMode)
        child.calculateFitness(source)

        this.population = child.fitness > this.population.fitness ? child : this.population

        resultCtx.clearRect(0, 0, this.dimensions.width, this.dimensions.height)
        this.population.render(resultCtx)
    }
}