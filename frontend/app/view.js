// View template
export function View(from, root, title = '', head = '') {
    from.root = root
    from.title = title
    from.head = head
    from.tree = document.createElement('div')
    from.start = (interval) => {
        if (!from.id) from.id = setInterval(from.compose, interval)
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
