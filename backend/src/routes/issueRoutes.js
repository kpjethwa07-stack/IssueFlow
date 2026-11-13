
const express = require("express");
const router = express.Router();

const {
    createIssue,
    getProjectIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    assignIssue,
    getIssueActivity,
} = require("../controllers/issueController");

const protect = require("../middleware/authMiddleware");

// CREATE ISSUE
router.post("/", protect, createIssue);

// GET PROJECT ISSUES
router.get("/project/:projectId", protect, getProjectIssues);

// GET SINGLE ISSUE
router.get("/:issueId", protect, getIssueById);

// UPDATE ISSUE
router.put("/:issueId", protect, updateIssue);

// ASSIGN / REASSIGN ISSUE
router.put("/:issueId/assign", protect, assignIssue);

// DELETE ISSUE
router.delete("/:issueId", protect, deleteIssue);

// GET ISSUE ACTIVITY
router.get("/:issueId/activity", protect, getIssueActivity);

module.exports = router;
