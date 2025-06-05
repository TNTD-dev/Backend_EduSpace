const { where } = require("sequelize");
const db = require("../models/index");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const { deserializeUser } = require("passport");

class ModuleControllers {
  getAllModules = async (req, res) => {
    try {
      const { courseId } = req.params;
      if (!courseId) {
        return errorResponse(res, "Missing required parameter: courseId", 400);
      }

      const moduleInfo = await db.Modules.findAll({
        where: {
          courseId: courseId,
        },
        include: [
          {
            model: db.Lessons,
            as: "Lessons",
            separate: true,
            order: [["order", "ASC"]],
          },
        ],
        order: [["order", "ASC"]],
      });

      if (moduleInfo && moduleInfo.length > 0) {
        return successResponse(
          res,
          moduleInfo,
          "Successfully get all modules",
          200
        );
      } else {
        return successResponse(
          res,
          [],
          "No modules found for this course",
          200
        );
      }
    } catch (err) {
      console.error("Error occured in getAllModules: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };
  getModule = async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const userId = req.user.id;

      if (!courseId) {
        return errorResponse(res, "Missing required parameter: courseId", 400);
      }
      if (!moduleId) {
        return errorResponse(res, "Missing required parameter: moduleId", 400);
      }

      const moduleInfo = await db.Modules.findOne({
        where: {
          courseId: courseId,
          id: moduleId,
        },
        include: [
          {
            model: db.Lessons,
            as: "Lessons",
            separate: true,
            order: [["order", "ASC"]],
          },
        ],
      });

      if (moduleInfo) {
        return successResponse(res, moduleInfo, "Successfully get module", 200);
      } else {
        return errorResponse(res, "Module not found", 404);
      }
    } catch (err) {
      console.error("Error occured in getModule: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  createModule = async (req, res) => {
    try {
      const { courseId } = req.params;
      const { title, description, imageURL } = req.body;
      const userId = req.user.id;

      // Check if use is valid instructor
      const isValidInstructor = await db.Courses.findOne({
        where: {
          id: courseId,
          instructorId: userId,
        },
      });

      if (!isValidInstructor) {
        return errorResponse(res, "Not Authorized", 403);
      }

      // Check duplicate
      const existed = await db.Modules.findOne({
        where: {
          courseId: courseId,
          title,
        },
      });

      if (existed) {
        return errorResponse(
          res,
          "You already have module with this title, please check again",
          400
        );
      }

      // Check missing values
      if (!title || !description) {
        return errorResponse(res, "Missing values", 400);
      }

      const newModule = await db.Modules.create({
        courseId,
        title,
        description,
        imageURL,
      });

      if (newModule) {
        return successResponse(
          res,
          newModule,
          "Create New Module Successfully",
          201
        );
      } else {
        return errorResponse(res, "Could not create new module");
      }
    } catch (err) {
      console.error("Error occured in createModule: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  updateModule = async (req, res) => {
    try {
      const userId = req.user.id;
      const { courseId, moduleId } = req.params;
      const { newTitle, newDescription, newImageURL } = req.body;

      // Check if user has authorization
      const isValidInstructor = await db.Courses.findOne({
        where: {
          id: courseId,
          instructorId: userId,
        },
      });

      if (!isValidInstructor) {
        return errorResponse(res, "Not Authorized", 403);
      }

      const module = await db.Modules.findByPk(moduleId);

      if (!module) {
        return errorResponse(res, "Module not found", 404);
      }

      const updateData = {};
      if (newTitle !== undefined) updateData.title = newTitle;
      if (newDescription !== undefined) updateData.description = newDescription;
      if (newImageURL !== undefined) updateData.imageURL = newImageURL;

      const updatedModule = await module.update(updateData);

      if (updatedModule) {
        return successResponse(
          res,
          updatedModule,
          "Successfully updated module",
          200
        );
      }
    } catch (err) {
      console.error("Error occured in update module: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  deleteModule = async (req, res) => {
    try {
      const { moduleId, courseId } = req.params;
      const { userId } = req.user.id;

      const isValidInstructor = await db.Courses.findOne({
        where: {
          id: courseId,
          instructorId: userId,
        },
      });

      if (!isValidInstructor) {
        return errorResponse(res, "Not Authorized", 403);
      }

      const module = await db.Modules.findByPk(moduleId);
      if (!module) {
        return errorResponse(res, "Module not found", 404);
      }

      await module.destroy();

      return successResponse(res, null, "Successfully deleted module", 200);
    } catch (err) {
      console.error("Error occured in deleteModule: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  getModuleProgress = async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const userId = req.user.id;

      // Lấy trạng thái progress của module
      const moduleProgress = await db.ModuleProgress.findOne({
        where: { studentId: userId, courseId, moduleId },
      });

      // Tính phần trăm hoàn thành module
      const totalLessons = await db.Lessons.count({
        where: { courseId, moduleId },
      });
      const completedLessons = await db.LessonProgress.count({
        where: { studentId: userId, courseId, moduleId, status: "completed" },
      });
      const percent =
        totalLessons === 0
          ? 0
          : Math.round((completedLessons / totalLessons) * 100);

      return successResponse(
        res,
        { moduleProgress, totalLessons, completedLessons, percent },
        "Module progress fetched",
        200
      );
    } catch (err) {
      console.error("Error in getModuleProgress:", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };
}

module.exports = new ModuleControllers();
