const { where } = require("sequelize");
const db = require("../models/index");
const { successResponse, errorResponse } = require("../utils/responseHelper");
// console.log(
//   "DB object state when lessonController is required:",
//   Object.keys(db)
// );

class lessonControllers {
  getAllLessons = async (req, res) => {
    try {
      const { moduleId } = req.params;
      const userId = req.user.id;

      const isValidModule = await db.Modules.findOne({
        where: { id: moduleId },
        order: [["order", "ASC"]],
      });
      if (!isValidModule) {
        return errorResponse(res, "Could not find module", 404);
      }
      const lessonsData = await db.Lessons.findAll({
        where: {
          moduleId: moduleId,
        },
      });

      if (lessonsData && lessonsData.length > 0) {
        return successResponse(
          res,
          lessonsData,
          "Successfully get all lessons of module",
          200
        );
      } else {
        return successResponse(
          res,
          null,
          "No lessons found for this module",
          200
        );
      }
    } catch (err) {
      console.error("Error occured in getAllLessons: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  getSingleLesson = async (req, res) => {
    try {
      const { moduleId, lessonId } = req.params;
      const userId = req.user.id;

      const isValidModule = await db.Modules.findOne({
        where: { id: moduleId },
        order: [["order", "ASC"]],
      });
      if (!isValidModule) {
        return errorResponse(res, "Could not find module", 404);
      }

      const lessonData = await db.Lessons.findOne({
        where: {
          moduleId: moduleId,
          id: lessonId,
        },
      });

      if (lessonData) {
        return successResponse(res, lessonData, "Successfully get lesson", 200);
      } else {
        return errorResponse(res, "Lesson not found", 404);
      }
    } catch (err) {
      console.error("Error occured in getSingleLesson: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  markAsCompleted = async (req, res) => {
    try {
      const { courseId, moduleId, lessonId } = req.params;
      const userId = req.user.id;
      if (!courseId || !moduleId || !lessonId) {
        return errorResponse(res, "Missing values", 400);
      }

      // 1. Tìm hoặc tạo LessonProgress
      let lessonProgress = await db.LessonProgress.findOne({
        where: { studentId: userId, moduleId, courseId, lessonId },
      });

      const now = new Date();

      if (!lessonProgress) {
        // Nếu chưa có, tạo mới
        lessonProgress = await db.LessonProgress.create({
          studentId: userId,
          moduleId,
          courseId,
          lessonId,
          status: "completed",
          completedAt: now,
        });
      } else if (lessonProgress.status === "completed") {
        // Nếu đã completed, trả về luôn
        return successResponse(
          res,
          { lessonProgress },
          "Already completed",
          200
        );
      } else {
        // Nếu chưa completed, update
        await lessonProgress.update({
          status: "completed",
          completedAt: now,
        });
      }

      // 2. Kiểm tra và cập nhật ModuleProgress nếu cần
      const totalLessons = await db.Lessons.count({
        where: { moduleId, courseId },
      });
      const completedLessons = await db.LessonProgress.count({
        where: { studentId: userId, moduleId, courseId, status: "completed" },
      });

      let moduleProgress = await db.ModuleProgress.findOne({
        where: { studentId: userId, moduleId, courseId },
      });

      if (completedLessons === totalLessons && totalLessons > 0) {
        // Đã hoàn thành tất cả lesson trong module
        if (moduleProgress) {
          await moduleProgress.update({
            status: "completed",
            completedAt: now,
          });
        } else {
          moduleProgress = await db.ModuleProgress.create({
            studentId: userId,
            moduleId,
            courseId,
            status: "completed",
            completedAt: now,
          });
        }
      } else if (moduleProgress && moduleProgress.status !== "inProgress") {
        // Nếu chưa hoàn thành nhưng đã bắt đầu
        await moduleProgress.update({ status: "inProgress" });
      }

      // 3. Kiểm tra và cập nhật CourseProgress nếu cần
      const totalModules = await db.Modules.count({ where: { courseId } });
      const completedModules = await db.ModuleProgress.count({
        where: { studentId: userId, courseId, status: "completed" },
      });

      let courseProgress = await db.CourseProgress.findOne({
        where: { studentId: userId, courseId },
      });

      if (completedModules === totalModules && totalModules > 0) {
        if (courseProgress) {
          await courseProgress.update({
            status: "completed",
            completedAt: now,
          });
        } else {
          courseProgress = await db.CourseProgress.create({
            studentId: userId,
            courseId,
            status: "completed",
            completedAt: now,
          });
        }
      } else if (courseProgress && courseProgress.status !== "inProgress") {
        await courseProgress.update({ status: "inProgress" });
      }

      // 4. Trả về thông tin progress mới nhất
      return successResponse(
        res,
        {
          lessonProgress,
          moduleProgress,
          courseProgress,
          lessonCompleted: completedLessons,
          lessonTotal: totalLessons,
          moduleCompleted: completedModules,
          moduleTotal: totalModules,
        },
        "Completed",
        200
      );
    } catch (err) {
      console.error("Error occured in markAsCompleted: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  createNewLesson = async (req, res) => {
    try {
      const userId = req.user.id;
      const { moduleId } = req.params;
      const {
        title,
        duration,
        completed = null,
        contentURL,
        contentData,
        type,
      } = req.body;

      if (!title || !duration || !contentURL || !contentData || !type) {
        return errorResponse(res, "Missing Values", 400);
      }

      const existedLesson = await db.Lessons.findOne({
        where: {
          moduleId: moduleId,
          title,
        },
      });

      if (existedLesson) {
        return errorResponse(
          res,
          "Lesson with this title is already in module",
          400
        );
      }

      const newLesson = await db.Lessons.create({
        moduleId,
        title,
        duration,
        completed,
        contentURL,
        contentData,
        type,
      });

      if (newLesson) {
        return successResponse(
          res,
          newLesson,
          "Successfully created new lesson",
          201
        );
      } else {
        return errorResponse(res, "Could not create new lesson", 400);
      }
    } catch (err) {
      console.error("Error occured in createNewLesson: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  updateLesson = async (req, res) => {
    try {
      const { lessonId, moduleId, courseId } = req.params;
      const userId = req.user.id;
      const { title, duration, completed, contentURL, contentData, type } =
        req.body;

      // Kiểm tra module thuộc course
      const module = await db.Modules.findOne({
        where: { id: moduleId, courseId: courseId },
      });
      if (!module) {
        return errorResponse(res, "Module not found in this course", 404);
      }

      // Kiểm tra lesson thuộc module
      const lesson = await db.Lessons.findOne({
        where: { id: lessonId, moduleId: moduleId },
      });
      if (!lesson) {
        return errorResponse(res, "Lesson not found in this module", 404);
      }

      // Chỉ update trường được gửi lên
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (duration !== undefined) updateData.duration = duration;
      if (completed !== undefined) updateData.completed = completed;
      if (contentURL !== undefined) updateData.contentURL = contentURL;
      if (contentData !== undefined) updateData.contentData = contentData;
      if (type !== undefined) updateData.type = type;

      await lesson.update(updateData);

      return successResponse(res, lesson, "Successfully updated lesson", 200);
    } catch (err) {
      console.error("Error occured in updateLesson: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  deleteLesson = async (req, res) => {
    try {
      const { lessonId, moduleId, courseId } = req.params;
      const userId = req.user.id;

      // Kiểm tra module thuộc course
      const module = await db.Modules.findOne({
        where: { id: moduleId, courseId: courseId },
      });
      if (!module) {
        return errorResponse(res, "Module not found in this course", 404);
      }

      // Kiểm tra lesson thuộc module
      const lesson = await db.Lessons.findOne({
        where: { id: lessonId, moduleId: moduleId },
      });
      if (!lesson) {
        return errorResponse(res, "Lesson not found in this module", 404);
      }

      await lesson.destroy();

      return successResponse(res, null, "Successfully deleted lesson", 200);
    } catch (err) {
      console.error("Error occured in deleteLesson: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };
}

module.exports = new lessonControllers();
