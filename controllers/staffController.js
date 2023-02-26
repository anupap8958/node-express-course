const Staff = require('../models/staff');

exports.index = async (req, res, next) => {

    const staff = await Staff.find().sort({ name: 1 });

    res.status(200).json({
        data: staff,
    });
}

exports.insert = async (req, res, next) => {

    const { name, salary } = req.body;

    const staff = new Staff({
        name: name,
        salary: salary,
    });

    await staff.save().then(() => {
        res.status(201).json({
            data: { message: 'inserted', staff: staff },
        });
    }).catch((err) => {
        res.status(500).json({
            data: { message: err.message },
        });
    });
}

exports.show = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id);

        if (!staff) {
            throw new Error('Staff not found');
        }

        res.status(201).json({
            data: staff,
        });

    } catch (error) {
        res.status(500).json({
            data: { message: error.message },
        });
    }
}

exports.destroy = async (req, res, next) => {
    try {
        const { id } = req.params;

        const staff = await Staff.findByIdAndDelete(id);

        if (!staff) {
            throw new Error('Staff not found');
        }

        res.status(201).json({
            message: "Staff deleted",
        });

    } catch (error) {
        res.status(500).json({
            data: { message: error.message },
        });
    }
}

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;

        const updateRequest = req.body;
        console.log(updateRequest);
        // check if update request is empty
        if (Object.keys(updateRequest).length === 0) {
            throw new Error('Update request is empty');
        }

        const staff = await Staff.findByIdAndUpdate(id, updateRequest, { new: true });

        if (!staff) {
            throw new Error('Staff not found');
        }

        res.status(201).json({
            data: { message: 'Updated staff', staff: staff },
        });

    } catch (error) {
        res.status(500).json({
            data: { message: error.message },
        });
    }
}
