class HTTPErrors extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "HTTPErrors";
    }
}

module.exports = HTTPErrors;
