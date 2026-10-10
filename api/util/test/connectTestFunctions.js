const connect = require("../connect");
const mongoose = require("mongoose");

async function attemptConnectionMultipleTimes(times, next) {
    for (let i = 0; i < times; i++) {
        await connect(null, null, next);
    }
}

function expectConnectionBehavior(next, expectedCalls) {
    expectDatabaseConnectionCalls(expectedCalls.connect.toHaveBeenCalledTimes);
    expect(next).toHaveBeenCalledTimes(expectedCalls.next.toHaveBeenCalledTimes);
}

function expectDatabaseConnectionCalls(toHaveBeenCalledTimes) {
    expect(mongoose.connect).toHaveBeenCalledTimes(toHaveBeenCalledTimes);
    expect(mongoose.connect).toHaveBeenCalledWith(process.env.mongoDB);
}

module.exports = {attemptConnectionMultipleTimes, expectConnectionBehavior};