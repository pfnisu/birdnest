// View template
export function View(from, root, title = '', live = true) {
    from.root = root
    from.title = title
    from.tree = document.createElement('div')
    from.start = (interval) => {
        if (live && !from.id) from.id = setInterval(from.compose, interval)
    }
    from.stop = () => {
        clearInterval(from.id)
        from.id = null
    }
    this.compose = () => {
        // Replace root tree
        from.root.replaceChildren(from.tree)
    }
}
