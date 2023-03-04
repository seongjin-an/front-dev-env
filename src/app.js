import axios from 'axios'
import './app.css'
import nyancat from './nyancat.jpg';

document.addEventListener('DOMContentLoaded', async () => {
    const res = await axios.get("/api/users");
    console.log('res:', res)
    document.body.innerHTML= `<img src=${nyancat} />`
    document.body.innerHTML = (res.data || []).map(user => {
        return `<div>${user.id}: ${user.name}</div>`
    }).join('')
})

console.log(process.env.NODE_ENV)
console.log(TWO)
console.log(THREE)
console.log('api.domain:', api.domain)