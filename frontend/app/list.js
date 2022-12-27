import {View} from './view.js'
import {request} from './request.js'

export function List(root) {
    View(this, root, 'Pilot list')
    this.compose = async () => {
        let json = await request.http('api')
        this.tree.innerHTML =
            `<h1>Perimeter violations in last 10 min</h1>
            <button>Toggle frequency (${request.interval / 1000} sec)</button>
            <div></div>`
        this.tree.querySelector('button').addEventListener('click', () => {
            request.interval = request.interval == 2000 ? 10000 : 2000
            // Stop old interval and start with new frequency
            this.stop()
            this.start(request.cookie('interval', request.interval))
        })
        if (json) {
            const content = this.tree.querySelector('div')
            json.sort((a, b) => parseFloat(a.radius) > parseFloat(b.radius))
            for (const pilot of json) {
                pilot.radius = parseInt(pilot.radius) / 1000
                content.innerHTML +=
                    `<p>${pilot.radius}m:
                        ${pilot.name}, ${pilot.phone}, ${pilot.email}</p>`
            }
        } else this.tree.innerHTML = '<p>Connection error. Retrying...</p>'
    }
}
