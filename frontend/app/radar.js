import {View} from './view.js'
import {request} from './request.js'

export function Radar(root) {
    View(this, root, 'Radar')
    // Draw a dot representing object on radar
    this.dot = (x, y, name = null, opaque = true, radius = 4) => {
        const ctx = this.canvas.getContext('2d')
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 360)
        opaque ? ctx.fill() : ctx.stroke()
        ctx.font = '20px sans-serif'
        if (name) ctx.fillText(name, x + radius + 2, y + 6)
    }
    this.compose = async () => {
        let json = await request.http('api/coords')
        this.tree.innerHTML =
            `<h1>Drone radar</h1>
            <p>Closest position of every detected drone</p>
            <canvas></canvas>`
        this.canvas = this.tree.querySelector('canvas')
        // Scale canvas to sensible resolution
        this.canvas.height = this.canvas.width = 1120
        this.dot(560, 560, '100m', false, 500)
        this.dot(560, 560, '50m', false, 250)
        this.dot(560, 560, 'Monadikuikka')
        if (json)
            for (const pilot of json)
                this.dot(
                    (pilot.x - 138000) / 200,
                    (pilot.y - 138000) / 200,
                    pilot.name)
    }
}
