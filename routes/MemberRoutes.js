//Import Express and MemberController
const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/MemberController');

router.post('/', MemberController.createMember); // Route for Creating a Member
router.get('/', MemberController.getAllMembers); // Route for Getting All Member Details
router.get('/:id', MemberController.getMember); // Route for Getting A Member Details
router.patch('/:id', MemberController.updateMember); // Route for Updating Member Details
router.get('/user/:userId', MemberController.getMembersByUser); // Route for Getting Members of a User

module.exports = router;