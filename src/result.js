import axios from 'axios'

const reuslt = {
    async render() {
        const res = await axios.get("/api/users")
        return (res.data ||[]).map(user => `<div>${user.id}: ${user.name}</div>`).join('')
    }
}

export default reuslt;