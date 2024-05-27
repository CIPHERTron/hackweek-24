const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send({message: "OK"});
})

app.listen(4567, () => {
    console.log("Server running in port 4567")
})