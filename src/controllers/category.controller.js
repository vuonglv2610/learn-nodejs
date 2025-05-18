const Response = require('../helpers/response');
const CategoryRepository = require('../repositories/category.repository');


module.exports = {
    getList: (req, res) => {
        // todo: validator
        CategoryRepository.get(req, res, (result) => {
            if (!result) {
                return Response.fail(req, res);
            }
            return Response.success(req, res, result);
        });
    },

    getOne: (req, res) => {
        CategoryRepository.getOne(req, res, (result) => {
            if (!result || result.length === 0) {
                return Response.fail(req, res, 404);
            }
            return Response.success(req, res, result);
        });
    },

    create: (req, res) => {
        CategoryRepository.create(req, res, (result) => {
            if (!result) {
                return Response.fail(req, res);
            }
            return Response.success(req, res, result);
        });
    },

    edit: (req, res) => {
        CategoryRepository.edit(req, res, (result) => {
            if (!result) {
                return Response.fail(req, res);
            }
            return Response.success(req, res, result);
        });
    },

    remove: (req, res) => {
        CategoryRepository.remove(req, res, (result) => {
            if (!result) {
                return Response.fail(req, res);
            }
            return Response.success(req, res, result);
        });
    },
};