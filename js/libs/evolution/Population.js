import Polygon from "./Polygon.js"

import { random } from "../math.js"

export default class Population {
    polygons = []
    fitness = 0

    constructor(dimensions, polygonCount, verticeCount) {
        if(!polygonCount && !verticeCount && Array.isArray(dimensions)) {
            this.polygons = dimensions
        } else {
            for(let i = 0; i < polygonCount; i++) {
                this.polygons.push(new Polygon(dimensions, verticeCount))
            }
        }
    }

    render(ctx) {
        for(const polygon of this.polygons) {
            polygon.render(ctx)
        }
    }
    
    mutate(dimensions, verticeCount, mutationMode) {
        for(let i = 0; i < this.polygons.length; i++) {
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
                        let vertexIndex = Math.floor(random(verticeCount))
                        
                        if(roulette < 1.5) {
                            this.polygons[i].vertices[vertexIndex][0] = random(dimensions.width)
                        } else {
                            this.polygons[i].vertices[vertexIndex][1] = random(dimensions.height)
                        }
                    }
                }
            }
        }   
    }

    calculateFitness(source, result) {
        let diff = 0

        for (let i = 0; i < source.data.length / 4; i++) {
            diff += Math.abs(source.data[4 * i + 0] - result.data[4 * i + 0]) / 255;
            diff += Math.abs(source.data[4 * i + 1] - result.data[4 * i + 1]) / 255;
            diff += Math.abs(source.data[4 * i + 2] - result.data[4 * i + 2]) / 255;
        }
    
        this.fitness = 100 * diff / (source.width * source.height * 3)
        return this.fitness
    }
}