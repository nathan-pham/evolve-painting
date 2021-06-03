import Population from "./Population.js"

import { resolution } from "../canvas.js"
import { random } from "../math.js"

export default class PopulationManager {
    mutationMode = 0.05
    verticeCount = 4
    populations = []
    dimensions = {}
    generation = 0

    constructor({ dimensions, populationCount=1, polygonCount=100, verticeCount=6, mutationMode="medium" }) {
        this.mutationMode = mutationMode
        this.verticeCount = verticeCount
        this.dimensions = dimensions

        for(let i = 0; i < populationCount; i++) {
            this.populations.push(new Population(dimensions, polygonCount, verticeCount))
        }

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        resolution(canvas, this.dimensions)

        this.testCtx = ctx
    }

    calculateFitness(sourceCtx) {
        const source = sourceCtx.getImageData(0, 0, this.dimensions.width, this.dimensions.height)

        let totalFitness = 0
        let bestPopulation = this.populations[0]

        for(const population of this.populations) {
            population.render(this.testCtx)
            const result = this.testCtx.getImageData(0, 0, this.dimensions.width, this.dimensions.height)

            population.calculateFitness(source, result)
            totalFitness += population.fitness
                
            if(population.fitness > bestPopulation.fitness) {
                bestPopulation = population
            }
        }

        for(const population of this.populations) {
            population.fitness /= totalFitness

            // 1-FITNESS_BEST/IWIDTH*IHEIGHT*3*255
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

    core(resultCtx, sourceCtx, crossover=false) {
        this.generation++

        const bestPopulation = this.calculateFitness(sourceCtx)
        const pool = this.generatePool()
        const cachePopulations = []

        for(let i = 0; i < this.populations.length; i++) {
            let child

            if(crossover) {
                let parentA = this.selectPopulation(pool)
                let parentB = this.selectPopulation(pool)
    
                let childPolygons = []
                let divider = Math.floor(Math.random() * parentA.polygons.length)
    
                for(let i = 0; i < parentA.polygons.length; i++) {
                    childPolygons.push(i < divider ? parentA.polygons[i] : parentB.polygons[i])
                }
    
                child = new Population(childPolygons)
            } else {
                child = new Population(this.selectPopulation(pool).polygons)
            }

            child.mutate(this.dimensions, this.verticeCount, this.mutationMode)
            cachePopulations.push(child)
        }

        this.populations = cachePopulations
        bestPopulation.render(resultCtx)
    }
}