import { h } from "../utils.js"

export const inputComponent = (title="unnamed-input", props) => {
    const input = h("div", { className: "input-wrapper" }, 
        h("input", { type: "range", ...props }),
        h("label", { for: props.name || props.id || "unnamed-input" }, title)
    )

    return input
}