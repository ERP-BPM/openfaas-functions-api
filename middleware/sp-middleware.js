const handler = require('../start-process/handler');

module.exports.startProcess = async (req, res) => {
    const cb = (err, functionResult) => {
        if (err) {
            console.error(err);

            return res.status(fnContext.status())
                .send(err.toString ? err.toString() : err);
        }

        if (isArray(functionResult) || isObject(functionResult)) {
            res.set(fnContext.headers())
                .status(fnContext.status()).send(JSON.stringify(functionResult));
        } else {
            res.set(fnContext.headers())
                .status(fnContext.status())
                .send(functionResult);
        }
    };

    const fnEvent = new FunctionEvent(req);
    const fnContext = new FunctionContext(cb);

    Promise.resolve(handler(fnEvent, fnContext, cb))
        .then(res => {
            if (!fnContext.cbCalled) {
                fnContext.succeed(res);
            }
        })
        .catch(e => {
            cb(e);
        });
};