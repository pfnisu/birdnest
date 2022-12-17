import {View} from './view.js'
import {request} from './request.js'

export function Map(root) {
    const view = new View(this, root, 'Map')
    this.compose = async () => {
        this.tree.innerHTML = '<h1>Drones on map</h1><div></div>'
        view.compose()
    }
}
