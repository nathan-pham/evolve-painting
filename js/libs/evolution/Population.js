import Polygon from "./Polygon.js"

import { random, randInt } from "../math.js"
import { resolution } from "../canvas.js"

export default class Population {
    dimensions = {}
    polygons = []
    fitness = -1

    constructor(dimensions, polygonCount, verticeCount, dnaMode) {
        this.dimensions = dimensions

        if(Array.isArray(polygonCount)) {
            this.polygons = polygonCount
            this.fitness = verticeCount
        } else {
            for(let i = 0; i < polygonCount; i++) {
                this.polygons.push(new Polygon(this.dimensions, verticeCount, dnaMode))
            }
        }

        this.testCanvas = document.createElement("canvas")
        this.testCtx = this.testCanvas.getContext("2d")
        resolution(this.testCanvas, this.dimensions)

        // document.body.appendChild(this.testCanvas)
        // this.testCtx.drawImage(document.querySelectorAll("canvas")[0], 0, 0, 100, 100)
    }

    render(ctx) {
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height)

        for(const polygon of this.polygons) {
            polygon.render(ctx)
        }
    }
    
    clone() {
        let polygons = []

        for(let polygon of this.polygons) {
            let polygonClone = new Polygon(this.dimensions)

            Object.assign(polygonClone, {
                color: {...polygon.color},
                vertices: polygon.vertices.reduce((acc, cur) => [...acc, [...cur]], [])
            })

            polygons.push(polygonClone)
        }

        return new Population(this.dimensions, [...polygons], this.fitness)
    }

    mutate(mutationMode) {
        let i = Math.floor(random(this.polygons.length))
        let polygon = this.polygons[i]

        switch(mutationMode) {
            case "medium": {
                const roulette = random(2)
                    
                if(roulette < 1) {
                    if(roulette < 0.25) {
                        polygon.color.r = randInt(255)
                    } else if(roulette < 0.5) {
                        polygon.color.g = randInt(255)
                    } else if(roulette < 0.75) {
                        polygon.color.b = randInt(255)
                    } else if(roulette < 1) {
                        polygon.color.a = Math.random()
                    }
                } else {
                    let vertexIndex = Math.floor(random(this.polygons[0].vertices.length))                
                    
                    if(roulette < 1.5) {
                        polygon.vertices[vertexIndex][0] = randInt(this.dimensions.width)
                    } else {
                        polygon.vertices[vertexIndex][1] = randInt(this.dimensions.height)
                    }
                }
            }
        }

        this.polygons[i] = polygon
    }

    calculateFitness(source) {
        let fitness = 0
        this.render(this.testCtx)
        const result = this.testCtx.getImageData(0, 0, this.dimensions.width, this.dimensions.height)

        for (let i = 0; i < source.data.length; i++) {
            if(i % 4 != 3) {
                fitness += Math.abs(source.data[i] - result.data[i])
            }
        }

        return fitness
    }
}