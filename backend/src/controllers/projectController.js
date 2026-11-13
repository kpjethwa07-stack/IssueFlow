
const Project = require("../models/Project");
const User = require("../models/User");

// CREATE PROJECT
const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project name is required",
            });
        }

        const project = await Project.create({
            name: name.trim(),
            description: description || "",
            owner: req.user,
            members: [],
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        console.error("Project creation error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// GET MY PROJECTS + SHARED PROJECTS
const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user },
                { members: req.user },
            ],
        })
            .populate("owner", "name username email")
            .populate("members", "name username email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });
    } catch (error) {
        console.error("Get projects error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// UPDATE PROJECT - OWNER ONLY
const updateProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const project = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.user,
            },
            {
                name,
                description,
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("owner", "name username email")
            .populate("members", "name username email");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found or you are not the owner",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        console.error("Project update error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// DELETE PROJECT - OWNER ONLY
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            owner: req.user,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found or you are not the owner",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Project deletion error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// GET PROJECT MEMBERS
const getProjectMembers = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [
                { owner: req.user },
                { members: req.user },
            ],
        })
            .populate("owner", "name username email")
            .populate("members", "name username email");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found or access denied",
            });
        }

        return res.status(200).json({
            success: true,
            owner: project.owner,
            members: project.members,
        });
    } catch (error) {
        console.error("Get project members error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// ADD MEMBER - OWNER ONLY
const addProjectMember = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Username is required",
            });
        }

        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found or you are not the owner",
            });
        }

        const user = await User.findOne({
            username: username.trim().toLowerCase(),
        }).select("_id name username email");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found with that username",
            });
        }

        if (user._id.toString() === project.owner.toString()) {
            return res.status(400).json({
                success: false,
                message: "Project owner already has access",
            });
        }

        const alreadyMember = project.members.some(
            (memberId) => memberId.toString() === user._id.toString()
        );

        if (alreadyMember) {
            return res.status(409).json({
                success: false,
                message: "User is already a project member",
            });
        }

        project.members.push(user._id);
        await project.save();

        return res.status(200).json({
            success: true,
            message: `${user.username} added to project`,
            member: user,
        });
    } catch (error) {
        console.error("Add project member error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// REMOVE MEMBER - OWNER ONLY
const removeProjectMember = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found or you are not the owner",
            });
        }

        const memberId = req.params.userId;

        const isMember = project.members.some(
            (id) => id.toString() === memberId
        );

        if (!isMember) {
            return res.status(404).json({
                success: false,
                message: "Member not found in this project",
            });
        }

        project.members = project.members.filter(
            (id) => id.toString() !== memberId
        );

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Member removed successfully",
        });
    } catch (error) {
        console.error("Remove project member error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    createProject,
    getMyProjects,
    updateProject,
    deleteProject,
    getProjectMembers,
    addProjectMember,
    removeProjectMember,
};
