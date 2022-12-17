import {View} from './view.js'

export function Info(root) {
    let view = new View(this, root, 'Info', false)
    this.compose = async () => {
        this.tree.innerHTML =
            `<h1>Project information</h1>
            <p>Repository available at: <a href=''>Github</a></p>
            <p>Everything regarding project definition and requirements are &copy; Reaktor, Inc.</p>
            <p>Project assignment can be viewed at: <a href='https://assignments.reaktor.com/birdnest/'>https://assignments.reaktor.com/birdnest/</a></p>
            <h1>Licence and contact information</h1>
            <p>Copyright (C) 2022 Niko Suoniemi <niko@tamperelainen.org></p>
            <p>This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3.</p>
            <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.</p>
            <p>You should have received a copy of the GNU Affero General Public License along with this program. If not, see <a href='https://www.gnu.org/licenses/'>https://www.gnu.org/licenses/</a></p>`
        view.compose()
    }
}

