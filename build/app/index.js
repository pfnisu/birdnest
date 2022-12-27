(()=>{function a(e,o,t="",r=!0){e.title=t,e.tree=document.createElement("div"),this.mount=()=>{o.replaceChildren(e.tree)},e.start=i=>{e.compose(),r&&!e.id&&(e.id=setInterval(()=>{document.visibilityState==="visible"&&e.compose()},i))},e.stop=()=>{clearInterval(e.id),e.id=null}}var n={cookie:(e,o=null)=>{let t=["",o];return o!==null?document.cookie=`${e}=${o}; SameSite=Strict`:t=document.cookie.match(new RegExp(`${e}=([\\d]+)`)),(t==null?void 0:t.length)>1?t[1]:null},http:async(e,o="GET")=>{try{let t=await fetch(e,{method:o,headers:{"Content-type":"application/json"}});if(t.ok)return await t.json()}catch(t){return null}}};function u(e){let o=new a(this,e,"Pilot list");this.compose=async()=>{this.tree.innerHTML=`<h1>Perimeter violations in last 10 min</h1>
            <button>Toggle frequency (${n.interval/1e3} sec)</button>
            <div></div>`,this.tree.querySelector("button").addEventListener("click",()=>{n.interval=n.interval==2e3?1e4:2e3,this.stop(),this.start(n.cookie("interval",n.interval))});let t=await n.http("api");if(t){let r=this.tree.querySelector("div");t.sort((i,c)=>parseFloat(i.radius)>parseFloat(c.radius));for(let i of t)i.radius=parseInt(i.radius)/1e3,r.innerHTML+=`<p>${i.radius}m:
                        ${i.name}, ${i.phone}, ${i.email}</p>`}else this.tree.innerHTML="<p>Connection error. Retrying...</p>";o.mount()}}function m(e){let o=new a(this,e,"Radar");this.dot=(t,r,i=null,c=!0,d=4)=>{let s=this.canvas.getContext("2d");s.beginPath(),s.arc(t,r,d,0,360),c?s.fill():s.stroke(),s.font="20px sans-serif",i&&s.fillText(i,t+d+2,r+6)},this.compose=async()=>{this.tree.innerHTML=`<h1>Drone radar</h1>
            <p>Closest position of every detected drone</p>
            <canvas></canvas>`,this.canvas=this.tree.querySelector("canvas"),this.canvas.height=this.canvas.width=1120,this.dot(560,560,"100m",!1,500),this.dot(560,560,"50m",!1,250),this.dot(560,560,"Monadikuikka");let t=await n.http("api/coords");if(t)for(let r of t)this.dot((r.x-138e3)/200,(r.y-138e3)/200,r.name);o.mount()}}function f(e){let o=new a(this,e,"Info",!1);this.compose=async()=>{this.tree.innerHTML=`<h1>Project information</h1>
            <p>Project assignment can be viewed at: <a href='https://assignments.reaktor.com/birdnest/'>https://assignments.reaktor.com/birdnest/</a></p>
            <p>Everything regarding project definition and requirements are &copy; Reaktor, Inc.</p>
            <p>Repository available at: <a href='https://github.com/pfnisu/birdnest'>https://github.com/pfnisu/birdnest</a></p>
            <h1>Licence</h1>
            <p>Copyright (C) 2022-2023 Niko Suoniemi <niko@tamperelainen.org></p>
            <p>This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3.</p>
            <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.</p>
            <p>You should have received a copy of the GNU Affero General Public License along with this program. If not, see <a href='https://www.gnu.org/licenses/'>https://www.gnu.org/licenses/</a></p>`,o.mount()}}var h=document.querySelector("nav"),p=document.querySelector("main"),l=[new u(p),new m(p),new f(p)],v=e=>{var t,r;l.forEach(i=>i.stop()),h.innerHTML=l.reduce((i,c)=>`${i}<a>${c.title}</a>`,"");let o=e?l.findIndex(i=>i.title===e.target.textContent):(t=n.cookie("tab"))!=null?t:0;h.children[o].className="active",document.title=`Birdnest - ${l[o].title}`,e||(n.interval=(r=n.cookie("interval"))!=null?r:1e4),l[o].start(n.interval),n.cookie("tab",o)};v();h.addEventListener("click",v,!0);})();
