/**
 * Stock functions
 */
"use strict";

const mongo = require("mongodb").MongoClient;
const dsn =  "mongodb://localhost:27017/stock";

const stock = {
    randomAroundZero: function () {
        return Math.random() < 0.5 ? -1 : 1;
    },
    getStockPrice: function (input) {
        let start = input.price;
        let rate = input.rate;
        let variance = input.variance;

        if (start < 5) {
            return start * rate + variance;
        } else if (start > 600 ){
            return start - 500;
        } else {
            return start * rate + variance * stock.randomAroundZero();
        }
    },
    save: async function (input) {
        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const count = await db.collection('stocks').countDocuments();
        let res;

        if (count < 34560) {
            res = await db.collection('stocks').insertOne({stocks: input});
        } else {
            res = await stock.reset();
        }

        await client.close();

        return res;
    },
    simulate: async function () {
        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const col = await db.collection('stocks');
        const res = await col.find().limit(500).sort({$natural: -1}).toArray();

        await client.close();

        return res.reverse();
    },
    reset: async function () {
        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const res = await db.dropDatabase();

        await client.close();

        return res;
    }
}

module.exports = stock;
