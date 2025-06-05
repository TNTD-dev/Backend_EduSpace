const { where } = require("sequelize");
const db = require("../models/index");
// console.log(
//   "DB object state when moduleAssignment is required:",
//   Object.keys(db)
// );
const { successResponse, errorResponse } = require("../utils/responseHelper");

class ModuleAssignmentControllers {
  getAllAssignments = async (req, res) => {
    try {
      const { moduleId, courseId } = req.params;
      if (!courseId || !moduleId) {
        return errorResponse(res, "Missing values", 400);
      }

      const allAssignment = await db.Assignments.findAll({
        where: { moduleId: moduleId },
      });

      if (!allAssignment || allAssignment.length === 0) {
        return successResponse(res, [], "No assignments found", 200);
      }

      return successResponse(
        res,
        allAssignment,
        "Successfully get all assignment",
        200
      );
    } catch (err) {
      console.error("Error occured in getAllAssignment: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  getAssignment = async (req, res) => {
    try {
      const { courseId, moduleId, assignmentId } = req.params;

      if (!courseId || !moduleId || !assignmentId) {
        return errorResponse(res, "Missing values", 400);
      }

      const assignment = await db.Assignments.findOne({
        where: {
          id: assignmentId,
          moduleId: moduleId,
        },
      });

      if (!assignment) {
        return errorResponse(res, "No assignment found", 404);
      } else {
        return successResponse(res, assignment, "Assignment found", 200);
      }
    } catch (err) {
      console.error("Error occured in getAssignment: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  createNewAssignment = async (req, res) => {
    try {
      const { moduleId } = req.params;
      const { title, status, description, dueDate } = req.body;

      if (!moduleId || !title || !description || !dueDate) {
        return errorResponse(res, "Missing values", 400);
      }

      // Validate dueDate
      const parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime()) || parsedDueDate < new Date()) {
        return errorResponse(res, "Invalid due date, please choose again", 400);
      }

      // 1. Tạo assignment trước
      const newAssignment = await db.Assignments.create({
        moduleId,
        title,
        dueDate: parsedDueDate,
        status,
        description,
      });

      // 2. Nếu có file upload, lưu vào AssignmentUpload
      if (req.files && req.files.length > 0) {
        // Lưu từng file vào bảng AssignmentUpload
        const uploadPromises = req.files.map((file) =>
          db.AssignmentUpload.create({
            assignmentId: newAssignment.id,
            fileURL: file.path, // hoặc file.filename nếu bạn muốn lưu tên file
            fileName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
            uploadedAt: new Date(),
          })
        );
        await Promise.all(uploadPromises);
      }

      // 3. Lấy lại assignment kèm file upload (nếu muốn trả về)
      const assignmentWithUploads = await db.Assignments.findByPk(
        newAssignment.id,
        {
          include: [{ model: db.AssignmentUpload, as: "uploads" }],
        }
      );

      return successResponse(
        res,
        assignmentWithUploads,
        "Successfully created new assignment",
        201
      );
    } catch (err) {
      console.error("Error occured in createNewAssignment: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  updateAssignment = async (req, res) => {
    try {
      const { moduleId, assignmentId } = req.params;
      const { title, status, dueDate, description } = req.body;

      if (!moduleId || !assignmentId) {
        return errorResponse(res, "Missing values", 400);
      }

      const assignment = await db.Assignments.findByPk(assignmentId);

      if (!assignment) {
        return errorResponse(res, "Could not find assignment", 404);
      }

      if (assignment.moduleId != moduleId) {
        return errorResponse(
          res,
          "Assignment does not belong to this module",
          400
        );
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (status !== undefined) updateData.status = status;
      if (dueDate !== undefined) {
        const parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate.getTime())) {
          return errorResponse(res, "Invalid due date format", 400);
        }
        if (parsedDueDate < new Date()) {
          return errorResponse(res, "Due date must be in the future", 400);
        }
        updateData.dueDate = parsedDueDate;
      }
      if (description !== undefined) updateData.description = description;

      const updatedAssignment = await assignment.update(updateData);

      return successResponse(
        res,
        updatedAssignment,
        "Successfully updated assignment",
        200
      );
    } catch (err) {
      console.error("Error occured in updateAssignment: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  deleteAssignment = async (req, res) => {
    try {
      const { assignmentId, moduleId } = req.params;

      const assignment = await db.Assignments.findOne({
        where: {
          id: assignmentId,
          moduleId: moduleId,
        },
      });

      if (!assignment) {
        return errorResponse(res, "Could not find assignment", 400);
      }

      await assignment.destroy();
      return successResponse(res, [], "Successfully deleted assignment", 200);
    } catch (err) {
      console.error("Error occured in deleteAssignment: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };
}

module.exports = new ModuleAssignmentControllers();
