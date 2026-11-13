
const express = require("express");

const {
    createProject,
    getMyProjects,
    updateProject,
    deleteProject,
    getProjectMembers,
    addProjectMember,
    removeProjectMember,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getMyProjects);

router.get("/:id/members", protect, getProjectMembers);
router.post("/:id/members", protect, addProjectMember);
router.delete("/:id/members/:userId", protect, removeProjectMember);

router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
