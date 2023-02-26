const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

/* http://localhost:3000/staff/ */
router.get('/', staffController.index);

/* get by id */
/* http://localhost:3000/staff/5f5f5f5f5f5f5f5f5f5f5f5f */
router.get('/:id', staffController.show);

/* http://localhost:3000/staff/ */
router.post('/', staffController.insert);

/* delete by id */
/* http://localhost:3000/staff/5f5f5f5f5f5f5f5f5f5f5f5f */
router.delete('/:id', staffController.destroy);

/* update by id */
/* http://localhost:3000/staff/5f5f5f5f5f5f5f5f5f5f5f5f */
router.put('/:id', staffController.update);

module.exports = router;
