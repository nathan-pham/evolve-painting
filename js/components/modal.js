import { h } from "../utils.js"

export const modalComponent = (title, ...children) => {
    const modal = h("div", { className: "modal-wrapper" },
        h("div", { className: "modal" },
            h("div", { className: "icon", onClick: () => {
                modal.remove()
                document.body.style.overflow = ''
            }},
                h("ion-icon", { name: "close-outline" })
            ),
            h("h1", {}, title || "modal"),
            ...children
        )
    )

    document.body.style.overflow = "hidden"

    return modal
}