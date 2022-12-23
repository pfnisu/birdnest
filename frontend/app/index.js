import {List} from './list.js'
import {Radar} from './radar.js'
import {Info} from './info.js'
import {request} from './request.js'

// Define state objects for views
const main = document.querySelector('main')
const views = [new List(main), new Radar(main), new Info(main)]

// Construct navigation from view titles
const tabs = views.map(view => view.title)
const nav = document.querySelector('nav')
nav.innerHTML = tabs.reduce((cat, el) => `${cat}<a>${el}</a>`, '')

// Set view to activated tab 
const setView = (ev) => {
    for (const v of views) v.stop()
    for (const c of nav.children) c.className = ''
    const index = ev
        ? tabs.indexOf(ev.target.textContent)
        : request.cookie('tab') ?? 0
    nav.children[index].className = 'active'
    document.title = `Birdnest - ${views[index].title}`
    request.interval = request.cookie('interval') ?? 10000
    views[index].start(request.interval)
    request.cookie('tab', index)
}

// Initialize view and setup a handler for nav
setView()
nav.addEventListener('click', setView, true)
