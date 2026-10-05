const { Department, User } = require('../models');
const { DEPARTMENT_BY_CATEGORY } = require('../utils/constants');

exports.departmentForCategory = async (category, transaction) => {
    const name =
        DEPARTMENT_BY_CATEGORY[category] ||
        DEPARTMENT_BY_CATEGORY.OTHER;

    return Department.findOne({
        where: {
            name,
            isActive: true
        },
        transaction
    });
};

exports.validateOfficer = async (id, transaction) => {
    const u = await User.findOne({
        where: {
            id,
            role: 'OFFICER',
            isActive: true
        },
        transaction
    });

    if (!u) {
        const e = new Error('Active officer not found');
        e.status = 404;
        throw e;
    }

    return u;
};