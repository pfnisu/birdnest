// View template
export function View(target, root, title = '', live = true) {
    target.title = title
    target.tree = document.createElement('div')
    // Update tree and mount to view
    const mount = async () => {
        await target.compose()
        root.replaceChildren(target.tree)
    }
    // Reload logic is only spawned if view is live and visible
    target.start = (interval) => {
        mount()
        if (live && !target.id)
            target.id = setInterval(() => {
                if (document.visibilityState === 'visible') mount()
            }, interval)
    }
    target.stop = () => {
        clearInterval(target.id)
        target.id = null
    }
}
