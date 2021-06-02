export const map = (n, inMin, inMax, outMin, outMax) => (
    (n - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
)

export const dist = (x1, y1, x2, y2) => (
    Math.sqrt(
        Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2)
    )
)

export const random = (min, max) => (
    !max ? Math.random() * min : Math.random() * (max - min) + min
)

export const constrain = (n, min, max) => (
    n < min
        ? min
        : n > max
            ? max
            : n
)