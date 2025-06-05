const { where } = require("sequelize");
const db = require("../models/index");
const { errorResponse } = require("../utils/responseHelper");

const isTeacher = async (req, res, next) => {
  const userId = req.user.id;
  const { courseId } = req.params;

  const isValidInstructor = await db.Courses.findOne({
    where: {
      id: courseId,
      instructorId: userId,
    },
  });

  if (isValidInstructor) {
    next();
  } else {
    return errorResponse(res, "Not Authorized", 403);
  }
};

module.exports = isTeacher;
