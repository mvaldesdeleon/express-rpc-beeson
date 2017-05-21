const { serialize, deserialize } = require('beeson');
const { raw } = require('body-parser');
const { rpc } = require('express-rpc');

const extract = req => ({
    method: req.path.split('/')[1],
    args: deserialize(req.body)
});
// TODO: add beeson content-header?
const success = (res, retVal) => res.status(200).send(serialize(retVal));
const error = (res, status, err) => res.status(status).send(err.stack);

module.exports = function(module, options = {}) {
    const parser = raw({
        limit: typeof options.limit === 'undefined' ? '10mb' : options.limit,
        // TODO: enforce beeson content-type and maybe throw a 400 back?
        type: () => true
    });

    const middleware = rpc({
        extract, success, error
    })(module, options);

    return function(req, res, next) {
        if (req.body) middleware(req, res, next);
        else parser(req, res, middleware);
    };
};
