const express = require('express');
const Roles = require('../models/role.model');
const Response = require('../helpers/response');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const roles = await Roles.findAll({
            where: {
                deletedAt: null,
            },
            // todo: add conditions query parameters
        });
        return Response.success(req, res, roles);
    } catch (error) {
        console.error('Error executing query:', error);
        return Response.fail(req, res, 500, 'Error fetching roles');
    }
});

module.exports = router;
