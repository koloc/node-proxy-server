class ExtendableError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.stack = (new Error()).stack;
        this.name = this.constructor.name;
    }
}


class ServerError extends ExtendableError {
    constructor(message) {
        super(message);

        this.isServerError = true;
    }
}

class ClientError extends ExtendableError {
    constructor(message, field, value) {
        super(message);

        this.isClientError = true;
        this.field = field;
        this.value = value;
    }
}

module.exports = {
    ClientError,
    ServerError,
};
