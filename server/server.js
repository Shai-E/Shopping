require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

const cookieParser = require("cookie-parser");

let whitelist = ['http://localhost:4200','http://localhost:80'];
let corsOptions = {
    origin: (origin, callback)=>{
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },credentials: true
}
app.use(require('cors')(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/shopping/api/auth", require("./routes/auth"));
app.use("/shopping/api/products", require("./routes/products"));
app.use("/shopping/api/carts", require("./routes/carts"));
app.use("/shopping/api/orders", require("./routes/orders"));

app.listen(port, console.log(`Listening on http://localhost:${port}`));
