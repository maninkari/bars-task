import "./app/css/styles.css"
const queuediv = document.getElementById("queue")
const bAdd = document.getElementById("btnAdd")
const WIDTH = 600
const HEIGHT = 30
const BARH = 5
const Q = []

let posting = false
let i = 0

bAdd.addEventListener("click", async () => {
  await queueUploadRequest()
})

const postData = async (payload, bar) => {
  posting = true
  const rectanglebar = bar.children[1].children[0]
  const req = new XMLHttpRequest()

  req.open("POST", "https://httpbin.org/post")

  req.upload.addEventListener("progress", (e) => {
    rectanglebar.setAttribute("width", `${Math.round((WIDTH * e.loaded) / e.total)}`)
  })

  req.addEventListener("load", () => {
    console.log(req.status)
    rectanglebar.setAttribute("fill", `LightSeaGreen`)
    posting = false
    processQ()
  })

  req.send(payload)
}

const queueUploadRequest = async () => {
  const fileField = document.querySelector('input[type="file"]')

  if (!fileField.files || fileField.files.length === 0) {
    return
  }

  const bar = barComponent(i++, fileField.files[0].name)
  const payload = new FormData()
  payload.append("doc", fileField.files[0])

  Q.push({ bar, payload })
  queuediv.appendChild(bar)
  processQ()
}

const processQ = async () => {
  if (!posting && Q.length > 0) {
    const elem = Q.shift()
    await postData(elem.payload, elem.bar)
  }
}

const barComponent = (i, filaname) => {
  let wrap = document.createElement("div")
  wrap.id = `wrap_${i}`
  wrap.width = WIDTH
  wrap.height = HEIGHT
  wrap.innerHTML = `
    <p>${filaname}</p>
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${BARH}" style="background-color:lightgray">
        <rect x="0" y="0" width="0px" height="${BARH}" fill="orange"></rect>
    </svg>`

  return wrap
}
