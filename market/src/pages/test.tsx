export function Test() {
const urlOrders = 'http://localhost:3000/orders'
const urlAdvertisements = 'http://localhost:3000/advertisements'

fetch(urlAdvertisements)
  .then(response => response.json())
  .then(data => console.log(data))

fetch(urlOrders)
  .then(response => response.json())
  .then(data => console.log(data))

  return (
  <h1>test</h1>
  )
}
