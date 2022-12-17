import {request} from './request.js'

export function Map(root) {
	this.title = 'Map'
	this.head = 'Drones on map'
    this.root = root
    this.tree = document.createElement('div')
    this.compose = async () => {
        // Replace root tree
        this.root.replaceChildren(this.tree)
    }
    this.start = (interval) => {
        if (!this.id) this.id = setInterval(this.compose, interval)
    }
    this.stop = () => {
        clearInterval(this.id)
        this.id = null
    }
}
