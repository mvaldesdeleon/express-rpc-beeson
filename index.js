const { serialize, deserialize } = require('beeson');
const { raw } = require('body-parser');
const { rpc } = require('express-rpc');

const extract = req => ({
    method: req.path.split('/')[1],
    args: deserialize(req.body)
});
// TODO: add beeson content-header?
const success = (res, retVal) => res.status(200).send(serialize(retVal));
const error = (res, status, err) => res.status(status).send(serialize(err));

module.exports = function(module, options = {}) {
    const parser = raw({
        limit: typeof options.limit === 'undefined' ? '10mb' : options.limit,
        // TODO: enforce beeson content-type and maybe throw a 400 back?
        type: () => true
    });

    const middleware = rpc({
        extract, success, error
    })(module, options);

    return {
        middleware: function(req, res, next) {
            if (req.body) middleware(req, res, next);
            else parser(req, res, middleware);
        },
        consumeWith: function(requester) {
            return function rpc(host, method, args = [], options = {}) {
                const port = options.port || 5000;
                const basePath = options.basePath || '';

                return requester({host, port, path: (basePath ? `/${basePath}` : '') + `/${method}`}, {body: serialize(args)})
                    .catch(err => {
                        if (err.response) {
                            let rpcError = deserialize(err.response.body);

                            err.stack = `From ${host}:${port}${path}:\n${rpcError.stack}\n\n${err.stack}`;
                        }

                        return Promise.reject(err);
                    })
                    .then(response => deserialize(response.body));
            };
        }
    };
};
