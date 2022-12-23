// View template
export function View(target, root, title = '', live = true) {
    target.title = title
    target.tree = document.createElement('div')
    // Call from target to replace root tree
    this.compose = () => {
        root.replaceChildren(target.tree)
    }
    // Reload logic is only spawned if view is live and visible
    target.start = (interval) => {
        target.compose()
        if (live && !target.id)
            target.id = setInterval(() => {
                if (document.visibilityState === 'visible') target.compose()
            }, interval)
    }
    target.stop = () => {
        clearInterval(target.id)
        target.id = null
    }
}
