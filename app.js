const express = require("express")
const path = require("path")

const routes = require("./routes")

var app = express()

app.set("port", process.env.PORT || 8080)

app.set("views", path.join(__dirname))
app.set("view engine", "ejs")

app.use(routes)
app.use(express.static(path.join(__dirname, 'JS')))

app.get('/editor', (req, res) =>{
    console.log("Editor opened")
    res.render("editor.ejs")
})

app.listen(app.get("port"), () =>{
    console.log("Server started on port "+app.get("port"))
})