// View template
export function View(target, root, title = '', live = true) {
    target.root = root
    target.title = title
    target.tree = document.createElement('div')
    // Reload logic is only spawned if view is live
    target.start = (interval) => {
        if (live && !target.id) target.id = setInterval(target.compose, interval)
    }
    target.stop = () => {
        clearInterval(target.id)
        target.id = null
    }
    // Call from target to replace root tree
    this.compose = () => {
        target.root.replaceChildren(target.tree)
    }
}
