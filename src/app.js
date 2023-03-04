import axios from 'axios'
import './app.css'
import nyancat from './nyancat.jpg';
import form from './form.js'
// import result from './result.js'

let formEl;
let resultEl;
document.addEventListener('DOMContentLoaded', async () => {
    const res = await axios.get("/api/users");
    console.log('res:', res)
    document.body.innerHTML= `<img src=${nyancat} />`
    document.body.innerHTML = (res.data || []).map(user => {
        return `<div>${user.id}: ${user.name}</div>`
    }).join('')


    //hot loading
    formEl = document.createElement("div")
    formEl.innerHTML = form.render()
    document.body.appendChild(formEl)

    // resultEl = document.createElement("div")
    // resultEl.innerHTML = await result.render();
    // document.body.appendChild(resultEl);
    import(/* webpackChunkName: "result" */"./result.js").then(async m => {
        const result = m.default;
        resultEl = document.createElement("div")
        resultEl.innerHTML = await result.render();
        document.body.appendChild(resultEl);
    })
})

console.log(process.env.NODE_ENV)
console.log(TWO)
console.log(THREE)
console.log('api.domain:', api.domain)

if (module.hot) {
    console.log("핫 모듈 켜짐")

    module.hot.accept("./result", async () => {
        console.log("result 모듈 변경됨")
        resultEl.innerHTML = await result.render();
    })

    module.hot.accept("./form", () => {
        formEl.innerHTML = form.render();
    })
}