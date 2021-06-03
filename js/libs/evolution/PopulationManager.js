import Population from "./Population.js"

import { resolution } from "../canvas.js"
import { random } from "../math.js"

export default class PopulationManager {
    mutationChance = 0.05
    verticeCount = 4
    populations = []
    dimensions = {}
    generation = 0

    constructor({ dimensions, populationCount=100, polygonCount=100, verticeCount=4, mutationChance=0.05 }) {
        this.mutationChance = mutationChance
        this.verticeCount = verticeCount
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

    generatePool() {
        const pool = []
        
        for(const population of this.populations) {
            for(let i = 0; i < population.fitness * 100; i++) {
                pool.push(population)
            }
        }
        
        return pool
    }

    selectPopulation(pool) {
        return pool[Math.floor(random(pool.length))]
    }

    core(resultCtx, sourceCtx) {
        this.generation++
        
        const bestPopulation = this.calculateFitness(sourceCtx)
        const pool = this.generatePool()
        const cachePopulations = []

        for(let i = 0; i < this.populations.length; i++) {
            let parentA = this.selectPopulation(pool)
            let parentB = this.selectPopulation(pool)

            let childPolygons = []
            let divider = Math.floor(Math.random() * parentA.polygons.length)

            for(let i = 0; i < parentA.polygons.length; i++) {
                childPolygons.push(i < divider ? parentA.polygons[i] : parentB.polygons[i])
            }

            let child = new Population(childPolygons)
            child.mutate(this.dimensions, this.verticeCount, this.mutationChance)
            cachePopulations.push(child)
        }

        this.populations = cachePopulations
        bestPopulation.render(resultCtx)
    }
}