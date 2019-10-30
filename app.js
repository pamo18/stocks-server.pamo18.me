/**
 * Price server
 */
"use strict";

const express = require('express');
const router = express.Router();
const app = express();
const cors = require('cors');
const index = require("./routes/index");
const stock = require("./models/stock");

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(cors());
app.use("/", index);

stock.reset();

io.origins(['https://pamocoin.pamo18.me:443']);

let pamocoinkr = {
    name: "PamoCoin to kr",
    coin: "pamocoin",
    rate: 1.0001,
    variance: 1.2,
    price: 20,
    currency: "krona"
};

let pamocoinbth = {
    name: "PamoCoin to BTHCoin",
    coin: "pamocoin",
    rate: 1.0002,
    variance: 0.8,
    price: 10,
    currency: "bthcoin"
};

let bthcoinkr = {
    name: "BTHCoin to kr",
    coin: "bthcoin",
    rate: 1.0001,
    variance: 1.2,
    price: 20,
    currency: "krona"
};

let bthcoinpamo = {
    name: "BTHCoin to PamoCoin",
    coin: "bthcoin",
    rate: 1.0002,
    variance: 0.8,
    price: 10,
    currency: "pamocoin"
};

const stocks = [pamocoinkr, bthcoinkr, pamocoinbth, bthcoinpamo];

const updateStocks = function() {
    stocks.map((coin) => {
        coin["price"] = stock.getStockPrice(coin);
        return coin;
    });

    stock.save(stocks);

    io.emit("stocks", stocks);
}

io.on('connection', function (socket) {
    console.info("User connected");

    socket.on('current', function () {
        updateStocks();
    });

    socket.on('simulate', async function () {
        let data = await stock.simulate();
        data.forEach(function(row) {
            socket.emit("stocks", row.stocks);
        })
    });
});

setInterval(function () {
    updateStocks();
}, 5000);

server.listen(8336);
