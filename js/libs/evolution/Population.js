import Polygon from "./Polygon.js"

import { resolution } from "../canvas.js"
import { random } from "../math.js"

export default class Population {
    dimensions = {}
    polygons = []
    fitness = 0

    constructor(dimensions, polygonCount, verticeCount, dnaMode) {
        this.dimensions = dimensions

        if(!verticeCount && Array.isArray(polygonCount)) {
            this.polygons = polygonCount
        } else {
            for(let i = 0; i < polygonCount; i++) {
                this.polygons.push(new Polygon(this.dimensions, verticeCount, dnaMode))
            }
        }

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        resolution(canvas, this.dimensions)

        this.testCtx = ctx
    }

    render(ctx) {
        for(const polygon of this.polygons) {
            polygon.render(ctx)
        }
    }
    
    clone() {
        return new Population(this.dimensions, this.polygons)
    }

    mutate(mutationMode) {
        let i = Math.floor(random(this.polygons.length))
        
        switch(mutationMode) {
            case "medium": {
                const roulette = random(2)
                    
                if(roulette < 1) {
                    if(roulette < 0.25) {
                        this.polygons[i].color.r = random(255)
                    } else if(roulette < 0.5) {
                        this.polygons[i].color.g = random(255)
                    } else if(roulette < 0.75) {
                        this.polygons[i].color.b = random(255)
                    } else if(roulette < 1) {
                        this.polygons[i].color.a = Math.random()
                    }
                } else {
                    let vertexIndex = Math.floor(random(this.polygons[0].vertices.length))                
                    
                    if(roulette < 1.5) {
                        this.polygons[i].vertices[vertexIndex][0] = random(this.dimensions.width)
                    } else {
                        this.polygons[i].vertices[vertexIndex][1] = random(this.dimensions.height)
                    }
                }
            }
        }
    }

    calculateFitness(source) {
        this.fitness = 0

        this.testCtx.fillStyle = "rgb(255, 255, 255)"
        this.testCtx.fillRect(0, 0, this.dimensions.width, this.dimensions.height)
        this.render(this.testCtx)

        const result = this.testCtx.getImageData(0, 0, this.dimensions.width, this.dimensions.height)

        for (let i = 0; i < source.data.length; i++) {
            if(i % 4 !== 3) {
                this.fitness += Math.abs(source.data[i] - result.data[i])
            }

            // depth = 4
            // diff += Math.abs(source.data[4 * i + 0] - result.data[4 * i + 0]) / 255;
            // diff += Math.abs(source.data[4 * i + 1] - result.data[4 * i + 1]) / 255;
            // diff += Math.abs(source.data[4 * i + 2] - result.data[4 * i + 2]) / 255;
        }

        return this.fitness
    }
}