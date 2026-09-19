const jwt = require("jsonwebtoken");
const { setTkn, getTkn } = require("../authentication");
const HTTPErrors = require("../HTTPErrors");

function testResultOfSignJWT(req) {
    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expectSignResultWithValues(0, "30m", req);
    expectSignResultWithValues(1, "3d", req);
}

function expectSignResultWithValues(index, expireTime, req) {
    expect(jwt.sign.mock.calls[index]).toEqual([
        {
            name: req.body.name,
            type: req.type,
        }, process.env.secretKey, 
        
        {
            expiresIn: expireTime
        }
    ]);
}

function expectCookiesHasRecorded(res, tknTest, cookieOptions) {
    const fifteenMinutes = 1000 * 60 * 15;
    const threeDays = 1000 * 60 * 60 * 24 * 3;

    expect(res.cookie).toHaveBeenCalledTimes(2);
        // expectCookieHasRecorded(res, tknTest, {name: "acessToken", options: cookieOptions, age: fifteenMinutes});
        // expectCookieHasRecorded(res, tknTest, {name: "refreshToken", options: cookieOptions, age: threeDays});
    cookieOptions.maxAge = fifteenMinutes;
    expect(res.cookie.mock.calls[0]).toEqual(["acessToken", tknTest, cookieOptions]);
    cookieOptions.maxAge = threeDays;
    expect(res.cookie.mock.calls[1]).toEqual(["refreshToken", tknTest, cookieOptions]);
}

function prepareRefreshTknTest(tkns, req, error = false) {
    req.headers.cookie = `refreshToken=${tkns.refresh}`;
    jwt.verify = mockJWTVerify(error);
}

function mockJWTVerify(error = false) {
    jwt.verify = jest.fn((token, password, callback) => {
        callback(error, {
            name: "teste",
            type: "client",
        });
    });

    return jwt.verify;
}

function testGetTkn(req, res, tkn) {
    const result = getTkn(req, res);

    expect(typeof jwt.verify.mock.calls[0][2]).toBe("function");
    expect(jwt.verify.mock.calls[0][0]).toBe(tkn);
    expect(result).toEqual({
        name: "teste",
        type: "client",
    })
}

function testGetTknErrorThrown(req, res, message) {
    expect(() => getTkn(req, res)).toThrow(new HTTPErrors(message, 403));
    expect(typeof jwt.verify.mock.calls[0][2]).toBe("function");
}

module.exports = {
    testResultOfSignJWT, expectCookiesHasRecorded, mockJWTVerify,
    testGetTkn, testGetTknErrorThrown, prepareRefreshTknTest
};