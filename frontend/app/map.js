import {View} from './view.js'
import {request} from './request.js'

export function Map(root) {
    let view = new View(this, root, 'Map', 'Drones on map')
    this.compose = async () => {
        this.tree.innerHTML = `<h1>${this.head}</h1><div></div>`
        view.compose()
    }
}
