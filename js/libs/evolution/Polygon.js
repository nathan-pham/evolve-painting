import { random } from "../math.js"

const randomColor = () => {
    const _random = (int) => Math.floor(random(int))
    return `rgba(${_random(255)}, ${_random(255)}, ${_random(255)}, ${random(1)})`
}

export default class Polygon {
    color = randomColor()
    vertices = []

    constructor(dimensions, verticeCount) {
        for(let i = 0; i < verticeCount; i++) {
            this.vertices.push([random(dimensions.width), random(dimensions.height)])
        }
    }

    render(ctx) {
        ctx.fillStyle = this.color
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
