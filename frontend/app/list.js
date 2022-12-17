import {request} from './request.js'

export function List(root) {
    this.title = 'Drone list'
    this.head = 'Drones seen in last 10 min'
    this.root = root
    this.tree = document.createElement('div')
    this.compose = async () => {
        let json = await request('api')
        this.tree.innerHTML = `<h1>${this.head}</h1><div></div>`
        const content = this.tree.querySelector('div')
        json.sort((a, b) => a.radius > b.radius)
        for (const pilot of json) {
            pilot.radius = parseInt(pilot.radius) / 1000
            content.innerHTML +=
                `<p>${pilot.radius}m:
                    ${pilot.name}, ${pilot.phone}, ${pilot.email}</p>`
        }
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
