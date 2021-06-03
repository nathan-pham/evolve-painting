import { random } from "../math.js"

export default class Polygon {
    vertices = []

    constructor(dimensions, verticeCount, dnaMode) {
        for(let i = 0; i < verticeCount; i++) {
            this.vertices.push([random(dimensions.width), random(dimensions.height)])
        }

        switch(dnaMode) {
            case "black":
                this.color = { r: 0, g: 0, b: 0, a: 0.001 }
                break
            case "white":
                this.color = { r: 255, g: 255, b: 255, a: 0.001 }
                break
            default:
                this.color = { r: random(255), g: random(255), b: random(255), a: 0.001 }
        }
    }

    render(ctx) {
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`
        ctx.beginPath()
    
        const [genesisX, genesisY] = this.vertices[0]
        ctx.moveTo(genesisX, genesisY)
        for(const vertice of this.vertices.slice(1)) {
            ctx.lineTo(vertice[0], vertice[1])
        }
        
        ctx.closePath()
        ctx.fill()
    }
}
