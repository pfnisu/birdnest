import {request} from './request.js'

export function Map(root) {
	this.title = 'Map'
	this.head = 'Drones on map'
    this.loaded = false
    this.root = root
    this.tree = document.createElement('div')
    this.compose = async () => {
        // Replace root tree
        this.root.replaceChildren(this.tree)
    }
}
