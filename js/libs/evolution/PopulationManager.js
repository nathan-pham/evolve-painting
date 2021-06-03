import Population from "./Population.js"

import { resolution } from "../canvas.js"
import { random } from "../math.js"

export default class PopulationManager {
    mutationMode = 0.05
    verticeCount = 4
    populations = []
    dimensions = {}

    generation = 0
    bestPopulation = { fitness: -1 }
    // fitnessPercent = 0

    constructor({ dimensions, populationCount=1, polygonCount=100, verticeCount=6, mutationMode="medium" }) {
        this.mutationMode = mutationMode
        this.verticeCount = verticeCount
        this.dimensions = dimensions

        for(let i = 0; i < populationCount; i++) {
            this.populations.push(new Population(dimensions, polygonCount, verticeCount))
        }
    }

    calculateFitness(source) {
        let totalFitness = 0
        let bestPopulation = { fitness: -1 }

        for(const population of this.populations) {
            population.calculateFitness(this.dimensions, source)

            if(population.fitness > bestPopulation.fitness) {
                bestPopulation = population
            }
            
            totalFitness += population.fitness
        }

        for(const population of this.populations) {
            population.fitness /= totalFitness
        }

        if(bestPopulation.fitness > this.bestPopulation.fitness) {
            this.bestPopulation = bestPopulation
        }
        
        // this.fitnessPercent = Math.abs((1 - (bestPopulation.fitness * totalFitness)) / (this.dimensions.width * this.dimensions.height * 3 * 255)) * 100

        return this.bestPopulation
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
        return this.populations.length == 1 ? this.populations[0] : pool[Math.floor(random(pool.length))]
    }

    core(resultCtx, source, crossover=false) {
        this.generation++

        this.calculateFitness(source)
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
    
                child = new Population(this.dimensions, childPolygons)
            } else {
                child = new Population(this.dimensions, this.selectPopulation(pool).polygons)
            }

            let childClone = child.clone()
            childClone.calculateFitness(this.dimensions, source)

            child.mutate(this.dimensions, this.verticeCount, this.mutationMode)
            child.calculateFitness(this.dimensions, source)

            const sortPopulations = [this.bestPopulation, childClone, child]
            const bestOfMutated = sortPopulations.reduce(function(a, b) {
                return a.fitness > b.fitness ? a : b
            })

            cachePopulations.push(bestOfMutated)
            
            // if(this.bestPopulation.fitness )

            // if( > ) {
            //     cachePopulations.push(childClone)
            // } else {
            //     cachePopulations.push(child)
            // }
        }

        this.populations = cachePopulations

        resultCtx.clearRect(0, 0, this.dimensions.width, this.dimensions.height)
        this.bestPopulation.render(resultCtx)
    }
}