
const Issue = require("../models/Issue");
const Project = require("../models/Project");
const User = require("../models/User");
const Activity = require("../models/Activity");

// HELPER: CHECK PROJECT ACCESS
const getAccessibleProject = (projectId, userId) => {
    return Project.findOne({
        _id: projectId,
        $or: [
            { owner: userId },
            { members: userId },
        ],
    });
};

// CREATE ISSUE
const createIssue = async (req, res) => {
    try {
        const { title, description, projectId, priority, labels } = req.body;

        const project = await getAccessibleProject(projectId, req.user);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found or access denied",
            });
        }

        const issue = await Issue.create({
            title,
            description,
            project: projectId,
            reporter: req.user,
            priority,
            labels,
        });

        await Activity.create({
            issue: issue._id,
            project: issue.project,
            user: req.user,
            action: "created",
            details: "Created this issue",
        });

        return res.status(201).json({
            success: true,
            message: "Issue created successfully",
            issue,
        });
    } catch (error) {
        console.error("Issue creation error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET PROJECT ISSUES
const getProjectIssues = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status, priority, search } = req.query;

        const project = await getAccessibleProject(projectId, req.user);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found or access denied",
            });
        }

        const filter = { project: projectId };

        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i",
            };
        }

        const issues = await Issue.find(filter)
            .populate("assignee", "name username email")
            .populate("reporter", "name username email");

        return res.status(200).json({
            success: true,
            count: issues.length,
            issues,
        });
    } catch (error) {
        console.error("Get issues error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET SINGLE ISSUE
const getIssueById = async (req, res) => {
    try {
        const { issueId } = req.params;

        const issue = await Issue.findById(issueId)
            .populate("assignee", "name username email")
            .populate("reporter", "name username email");

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        const project = await getAccessibleProject(issue.project, req.user);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        return res.status(200).json({
            success: true,
            issue,
        });
    } catch (error) {
        console.error("Get issue error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// UPDATE ISSUE
const updateIssue = async (req, res) => {
    try {
        const { issueId } = req.params;

        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        const project = await getAccessibleProject(issue.project, req.user);

        if (!project) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this issue",
            });
        }

        const { title, description, status, priority, labels } = req.body;
        const activities = [];

        if (status !== undefined && status !== issue.status) {
            activities.push({
                issue: issue._id,
                project: issue.project,
                user: req.user,
                action: "status_changed",
                details: `Status changed from ${issue.status} to ${status}`,
            });

            issue.status = status;
        }

        if (priority !== undefined && priority !== issue.priority) {
            activities.push({
                issue: issue._id,
                project: issue.project,
                user: req.user,
                action: "priority_changed",
                details: `Priority changed from ${issue.priority} to ${priority}`,
            });

            issue.priority = priority;
        }

        if (title !== undefined) issue.title = title;
        if (description !== undefined) issue.description = description;
        if (labels !== undefined) issue.labels = labels;

        const updatedIssue = await issue.save();

        if (activities.length > 0) {
            await Activity.insertMany(activities);
        }

        return res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            issue: updatedIssue,
        });
    } catch (error) {
        console.error("Update issue error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// DELETE ISSUE
const deleteIssue = async (req, res) => {
    try {
        const { issueId } = req.params;

        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        const project = await getAccessibleProject(issue.project, req.user);

        if (!project) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this issue",
            });
        }

        await issue.deleteOne();

        // Remove related activity records too
        await Activity.deleteMany({ issue: issue._id });

        return res.status(200).json({
            success: true,
            message: "Issue deleted successfully",
        });
    } catch (error) {
        console.error("Delete issue error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ASSIGN / REASSIGN ISSUE
const assignIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        const { assigneeId } = req.body;

        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        const project = await getAccessibleProject(issue.project, req.user);

        if (!project) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        let assignee = null;

        if (assigneeId) {
            // Assignee must be a member or the owner of THIS project
            const isOwner =
                project.owner.toString() === assigneeId.toString();

            const isMember = project.members.some(
                (memberId) => memberId.toString() === assigneeId.toString()
            );

            if (!isOwner && !isMember) {
                return res.status(400).json({
                    success: false,
                    message: "Assignee must belong to this project",
                });
            }

            assignee = await User.findById(assigneeId).select(
                "name username email"
            );

            if (!assignee) {
                return res.status(404).json({
                    success: false,
                    message: "Assignee not found",
                });
            }
        }

        const previousAssignee = issue.assignee;

        issue.assignee = assigneeId || null;

        const updatedIssue = await issue.save();

        await Activity.create({
            issue: issue._id,
            project: issue.project,
            user: req.user,
            action: "assigned",
            details: assignee
                ? `Assigned to ${assignee.username || assignee.name}`
                : "Issue unassigned",
        });

        return res.status(200).json({
            success: true,
            message: previousAssignee
                ? "Assignee updated successfully"
                : "Issue assigned successfully",
            issue: updatedIssue,
        });
    } catch (error) {
        console.error("Assign issue error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET ISSUE ACTIVITY
const getIssueActivity = async (req, res) => {
    try {
        const { issueId } = req.params;

        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        const project = await getAccessibleProject(issue.project, req.user);

        if (!project) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this activity",
            });
        }

        const activities = await Activity.find({
            issue: issueId,
        })
            .populate("user", "name username")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: activities.length,
            activities,
        });
    } catch (error) {
        console.error("Activity error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// EXPORT CONTROLLERS
module.exports = {
    createIssue,
    getProjectIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    assignIssue,
    getIssueActivity,
};
