import Polygon from "./Polygon.js"

export default class Population {
    polygons = []
    fitness = 0

    constructor(dimensions, verticeCount, polygonCount) {
        for(let i = 0; i < polygonCount; i++) {
            this.polygons.push(new Polygon(dimensions, verticeCount))
        }
    }

    render(ctx) {
        for(const polygon of this.polygons) {
            polygon.render(ctx)
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