const Response = require('../helpers/response');
const ShoppingCartRepository = require('../repositories/shoppingcart.repository');

module.exports = {
    getList: (req, res) => {
        // todo: validator
        ShoppingCartRepository.get(req, res, (result) => {
            if (!result) {
                return Response.fail(req, res);
            }
            return Response.success(req, res, result);
        });
    },

    getOne: (req, res) => {
        ShoppingCartRepository.getOne(req, res, (result) => {
            if (!result || result.length === 0) {
                return Response.fail(req, res, 404);
            }
            return Response.success(req, res, result);
        });
    },

    getOneByCustomerId: (req, res) => {
        ShoppingCartRepository.getOneByCustomerId(req, res, (result) => {
            // if (!result || result.length === 0) {
            //     return Response.fail(req, res, 404);
            // }
            return Response.success(req, res, result);
        });
    },

    create: (req, res) => {
        ShoppingCartRepository.create(req, res, (result) => {
            if (!result) {
                return Response.fail(req, res);
            }
            return Response.success(req, res, result);
        });
    },

    edit: (req, res) => {
        ShoppingCartRepository.edit(req, res, (result) => {
            if (!result) {
                return Response.fail(req, res);
            }
            return Response.success(req, res, result);
        });
    },

    remove: (req, res) => {
        ShoppingCartRepository.remove(req, res, (result) => {
            if (!result) {
                return Response.fail(req, res);
            }
            return Response.success(req, res, result);
        });
    },
};
