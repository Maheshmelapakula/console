const express = require("express");
const UserModel = require("../models/User.model");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// Route to get all users
router.get("/", auth, role("admin"), async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

router.get("/:id", auth, role("admin"), async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
        console.log("Error in getting user id");
    }
});

router.put("/:id", auth, role("admin"), async (req, res) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
        console.log("Error in updating user id");
    }
});

router.delete("/:id", auth, role("admin"), async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
        console.log("Error in removing user");
    }
});

module.exports = router;
