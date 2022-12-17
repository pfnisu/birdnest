import {View} from './view.js'
import {request} from './request.js'

export function List(root) {
    let view = new View(this, root, 'Drone list')
    this.compose = async () => {
        let json = await request('api')
        this.tree.innerHTML = '<h1>Drones seen in last 10 min</h1><div></div>'
        const content = this.tree.querySelector('div')
        json.sort((a, b) => a.radius > b.radius)
        for (const pilot of json) {
            pilot.radius = parseInt(pilot.radius) / 1000
            content.innerHTML +=
                `<p>${pilot.radius}m:
                    ${pilot.name}, ${pilot.phone}, ${pilot.email}</p>`
        }
        view.compose()
    }
}
