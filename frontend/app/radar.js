import {View} from './view.js'
import {request} from './request.js'

export function Radar(root) {
    const view = new View(this, root, 'Radar')
    // Draw a dot representing object on radar
    this.dot = (x, y, name = null, opaque = true, radius = 4) => {
        const ctx = this.canvas.getContext('2d')
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 360)
        opaque ? ctx.fill() : ctx.stroke()
        ctx.font = '14px sans-serif'
        if (name) ctx.fillText(name, x + radius + 2, y + 4)
    }
    this.compose = async () => {
        let json = await request('api/coords')
        this.tree.innerHTML = '<h1>Drone radar</h1><canvas></canvas>'
        this.canvas = this.tree.querySelector('canvas')
        // Scale canvas 2x for better resolution
        this.canvas.height = this.canvas.width = 1000
        this.dot(500, 500, 'Monadikuikka')
        this.dot(500, 500, '100m', false, 498)
        this.dot(500, 500, '50m', false, 250)
        for (const pilot of json) {
            this.dot((pilot.x - 150000) / 200, (pilot.y - 150000) / 200, pilot.name)
        }
        view.compose()
    }
}
