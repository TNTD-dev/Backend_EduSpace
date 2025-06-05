const { where } = require("sequelize");
const db = require("../models/index");
console.log(
  "DB object state when assignmentSubmissionController is required:",
  Object.keys(db)
);
const { errorResponse, successResponse } = require("../utils/responseHelper");

class AssignmentSubmission {
  getStudentSubmissions = async (req, res) => {
    try {
      const { assignmentId, moduleId } = req.params;

      if (!assignmentId || !moduleId) {
        return errorResponse(res, "Missing values", 400);
      }

      const allSubmission = await db.assignmentSubmission.findAll({
        where: {
          assignmentId: assignmentId,
        },
      });

      if (!allSubmission || allSubmission.length === 0) {
        return errorResponse(res, "Could not find any submission", 400);
      }

      return successResponse(
        res,
        allSubmission,
        "Successfully get all submissions",
        200
      );
    } catch (err) {
      console.error("Error occured in getStudentSubmission: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  getSingleStudentSubmission = async (req, res) => {
    try {
      const { studentId, assignmentId } = req.params;
      if (!studentId || !assignmentId) {
        return errorResponse(res, "Missing values", 400);
      }

      const studentSubmission = await db.assignmentSubmission.findOne({
        where: {
          assignmentId: assignmentId,
          studentId: studentId,
        },
      });

      if (!studentSubmission) {
        return errorResponse(res, "Could not find submissions", 400);
      }

      return successResponse(
        res,
        studentSubmission,
        "Successfully found submission",
        200
      );
    } catch (err) {
      console.error("Error occured in getSingleStudentSubmission: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  getSubmission = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const userId = req.user.id;
      if (!assignmentId) {
        return errorResponse(res, "Missing values", 400);
      }

      const studentSubmission = await db.AssignmentSubmission.findOne({
        where: {
          assignmentId: assignmentId,
          studentId: userId,
        },
      });

      if (!studentSubmission) {
        return errorResponse(
          res,
          "Could not find submission for this assignment",
          404
        );
      }

      return successResponse(
        res,
        studentSubmission,
        "Found submission successfully",
        200
      );
    } catch (err) {
      console.error("Error occured in getSubmission: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  submitAssignment = async (req, res) => {
    try {
      const userId = req.user.id;
      const { textContent } = req.body;
      const { assignmentId } = req.params;
      const file = req.file;
      // kiem tra assignment
      const assignment = await db.Assignment.findByPk(assignmentId);
      if (!assignment) {
        return errorResponse(res, "Could not found assignment", 400);
      }
      // Kiem tra isLate
      const now = new Date();
      const isLate = assignment.dueDate && now > assignment.dueDate;

      // Kiem tra noi dung nop len
      if (!file && (!textContent || textContent.trim() === "")) {
        return errorResponse(res, "You must submit a file or content", 400);
      }

      const submission = await db.AssignmentSubmission.create({
        assignmentId,
        moduleId: assignment.moduleId,
        studentId: userId,
        fileURL: file ? file.path : null,
        fileName: file ? file.originalname : null,
        mimeType: file ? file.mimetype : null,
        fileSize: file ? file.size : null,
        textContent: textContent || null,
        submittedAt: now,
        isLate,
      });

      return successResponse(res, submission, "Submitted successfully", 201);
    } catch (err) {
      console.error("Error occured in submitAssignment: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  gradeStudent = async (req, res) => {
    try {
      const { assignmentId, studentId } = req.params;
      const { grade, feedback } = req.body;
      if (!assignmentId || !studentId) {
        return errorResponse(res, "Missing values", 400);
      }

      const studentSubmission = await db.AssignmentSubmission.findOne({
        where: {
          assignmentId: assignmentId,
          studentId: studentId,
        },
      });

      if (!studentSubmission) {
        return errorResponse(res, "Could not find submission", 404);
      }

      await studentSubmission.update({
        grade: grade,
        feedback: feedback,
      });

      return successResponse(
        res,
        studentSubmission,
        "Graded student successfully",
        200
      );
    } catch (err) {
      console.error("Error occured in gradeStudent: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  changeSubmission = async (req, res) => {
    try {
      const { assignmentId, submissionId } = req.params;
      const userId = req.user.id;
      const { textContent } = req.body;
      const file = req.file;

      const submission = await db.AssignmentSubmission.findOne({
        where: {
          id: submissionId,
          assignmentId: assignmentId,
          studentId: userId,
        },
      });

      if (!submission) {
        return errorResponse(res, "Could not find submission", 404);
      }
      const now = new Date();

      await submission.update({
        textContent: textContent || null,
        fileName: file ? file.originalname : null,
        fileURL: file ? file.path : null,
        mimeType: file ? file.mimetype : null,
        fileSize: file ? file.size : null,
        submittedAt: now,
      });

      return successResponse(
        res,
        submission,
        "Successfully updated submission",
        200
      );
    } catch (err) {
      console.error("Error occured in changeSubmission: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };
}
module.exports = new AssignmentSubmission();
