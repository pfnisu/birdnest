// View template
export function View(target, root, title = '', live = true) {
    target.root = root
    target.title = title
    target.tree = document.createElement('div')
    // Call from target to replace root tree
    this.compose = () => {
        target.root.replaceChildren(target.tree)
    }
    // Reload logic is only spawned if view is live
    target.start = async (interval) => {
        await target.compose()
        if (live && !target.id) target.id = setInterval(target.compose, interval)
    }
    target.stop = () => {
        clearInterval(target.id)
        target.id = null
    }
}
