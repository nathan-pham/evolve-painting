import Polygon from "./Polygon"

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

        for (let i = 0; i < sourceData.data.length / 4; i++) {
            diff += Math.abs(sourceData.data[4 * i + 0] - resultData.data[4 * i + 0]) / 255;
            diff += Math.abs(sourceData.data[4 * i + 1] - resultData.data[4 * i + 1]) / 255;
            diff += Math.abs(sourceData.data[4 * i + 2] - resultData.data[4 * i + 2]) / 255;
        }
    
        let fitness = 100 * diff / (sourceData.width * sourceData.height * 3)
        this.fitness = fitness
        return fitness
    }
}