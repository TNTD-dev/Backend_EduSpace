const { where } = require("sequelize");
const db = require("../models/index");
const { successResponse, errorResponse } = require("../utils/responseHelper");

const isMember = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    if (!courseId) {
      return errorResponse(res, "Missing user or course", 400);
    }

    const isStudent = await db.CoursesEnrollments.findOne({
      where: {
        courseId: courseId,
        studentId: userId,
      },
    });

    const isInstructor = await db.Courses.findOne({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });

    if (isStudent || isInstructor) {
      next();
    } else {
      // Nếu không phải sinh viên VÀ không phải giảng viên
      return errorResponse(res, "Not Authorized to access this course", 403);
    }
  } catch (err) {
    console.error("Error occured in /utils/isMember:  ", err);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

module.exports = isMember;
