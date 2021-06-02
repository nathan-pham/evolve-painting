const fps = 60
const interval = 1000 / fps

let then, elapsed, update
let rID

const startAnimation = (loop) => {
    update = loop
    then = Date.now()
    animationLoop()
}

const animationLoop = () => {
    try {
        rID = requestAnimationFrame(animationLoop)

        const now = Date.now()
        elapsed = now - then

        if(elapsed > interval) {
            then = now - (elapsed % interval)
            update()
        }
    } catch(e) {
        cancelAnimationFrame(rID)
        throw new Error(e)
    }
}

const animate = (loop) => {
    if(typeof loop == "function") {
        startAnimation(loop)
    } else {
        throw new Error("animation loop must be a function")
    }
}

export default animate