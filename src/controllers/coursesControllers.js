// controllers/coursesControllers.js
const db = require("../models/index");
import { where } from "sequelize";

import { successResponse, errorResponse } from "../utils/responseHelper";
const { generateCourseCode } = require("../services/randomCourseCode");

class CoursesControllers {
  // Get all courses
  getAllCourses = async (req, res) => {
    try {
      const coursesInfor = await db.Courses.findAll({
        include: [
          {
            model: db.Users,
            as: "Instructor",
            attributes: ["id", "firstname", "lastname"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (!coursesInfor) {
        return successResponse(res, [], "No courses found");
      }

      return successResponse(res, coursesInfor);
    } catch (err) {
      console.error("Error in getAllCourses:", err);
      return errorResponse(res, "Internal server error", 500);
    }
  };

  // Get single course
  getSingleCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const course = await db.Courses.findOne({
        where: { id: courseId },
        include: [
          {
            model: db.Users,
            as: "Instructor",
            attributes: ["id", "firstname", "lastname"],
          },
        ],
      });

      if (!course) {
        return errorResponse(res, "Course not found", 404);
      }

      

      // Chuẩn hóa dữ liệu trả về cho FE edit
      const courseData = {
        id: course.id,
        title: course.title,
        category: course.category,
        categoryColor: course.categoryColor,
        description: course.description,
        startDate: course.startDate,
        endDate: course.endDate,
        schedule: course.schedule,
        location: course.location,
        image: course.image,
        status: course.status,
        instructorId: course.instructorId,
        instructorName: course.Instructor?.dataValues 
          ? `${course.Instructor.dataValues.firstname || ""} ${course.Instructor.dataValues.lastname || ""}`.trim()
          : "",
      };

      

      return successResponse(res, courseData);
    } catch (err) {
      console.error("Error in getSingleCourse:", err);
      return errorResponse(res, "Internal server error", 500);
    }
  };

  // Create new course
  createNewCourse = async (req, res) => {
    const transaction = await db.sequelize.transaction();

    try {
      const { title, category, description, startDate, endDate, schedule, location, image } = req.body;

      // Validation
      if (!title || !category) {
        return errorResponse(res, "Title and category are required", 400);
      }

      let code;
      let exists = true;
      const length = 6;
      do {
        code = generateCourseCode(length);
        const found = await db.Courses.findOne({ where: { enrollCode: code } });
        exists = !!found;
      } while (exists);

      // Danh sách màu có thể dùng
      const colorList = [
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-red-500",
        "bg-pink-500",
        "bg-purple-500",
        "bg-orange-500",
        // ... thêm màu tùy ý
      ];

      // Kiểm tra xem category đã có màu chưa
      let categoryColor;
      const existingCourse = await db.Courses.findOne({
        where: { category }
      });
      if (existingCourse && existingCourse.categoryColor) {
        // Nếu đã có, dùng lại màu cũ
        categoryColor = existingCourse.categoryColor;
      } else {
        // Nếu chưa có, chọn màu chưa dùng
        const usedColors = (await db.Courses.findAll({
          attributes: ['categoryColor'],
          group: ['categoryColor']
        })).map(c => c.categoryColor);

        const availableColors = colorList.filter(color => !usedColors.includes(color));
        if (availableColors.length > 0) {
          categoryColor = availableColors[Math.floor(Math.random() * availableColors.length)];
        } else {
          // Nếu hết màu, chọn lại ngẫu nhiên trong danh sách
          categoryColor = colorList[Math.floor(Math.random() * colorList.length)];
        }
      }

      const newCourse = await db.Courses.create(
        {
          title,
          category,
          description,
          enrollCode: code,
          startDate,
          endDate,
          schedule,
          location,
          image,
          instructorId: req.user.id,
          status: "draft",
          categoryColor,
        },
        { transaction }
      );

      await transaction.commit();

      return successResponse(
        res,
        newCourse,
        "Course created successfully",
        201
      );
    } catch (err) {
      await transaction.rollback();
      console.error("Error in createNewCourse:", err);
      return errorResponse(res, "Internal server error", 500);
    }
  };

  // Update course
  updateCourse = async (req, res) => {
    const transaction = await db.sequelize.transaction();

    try {
      const { courseId } = req.params;
      const updateData = req.body;

      const course = await db.Courses.findByPk(courseId);
      if (!course) {
        return errorResponse(res, "Course not found", 404);
      }

      if (course.instructorId !== req.user.id) {
        return errorResponse(res, "Not authorized to update this course", 403);
      }

      await course.update(updateData, { transaction });
      await transaction.commit();

      return successResponse(res, course, "Course updated successfully", 200);
    } catch (err) {
      await transaction.rollback();
      console.error("Error in updateCourse:", err);
      return errorResponse(res, "Internal server error", 500);
    }
  };

  // Delete course
  deleteCourse = async (req, res) => {
    const transaction = await db.sequelize.transaction();

    try {
      const { courseId } = req.params;

      const course = await db.Courses.findByPk(courseId);
      if (!course) {
        return errorResponse(res, "Course not found", 404);
      }

      if (course.instructorId !== req.user.id) {
        return errorResponse(res, "Not authorized to delete this course", 403);
      }

      const { canDelete, message } = await canDeleteCourse(course);
      if (!canDelete) {
        return errorResponse(res, message, 400);
      }

      await cleanupData(course.id, transaction);
      await course.destroy({ transaction });
      await transaction.commit();

      return successResponse(res, null, "Course deleted successfully", 200);
    } catch (err) {
      await transaction.rollback();
      console.error("Error in deleteCourse:", err);
      return errorResponse(res, "Internal server error", 500);
    }
  };

  getCourseProgress = async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.user.id;

      const courseProgress = await db.CourseProgress.findOne({
        where: {
          studentId: userId,
          courseId: courseId,
        },
      });

      const totalModules = await db.Modules.count({
        where: { courseId },
      });

      const completedModules = await db.ModuleProgress.count({
        where: {
          studentId: userId,
          courseId: courseId,
          status: "completed",
        },
      });

      const percent =
        totalModules === 0
          ? 0
          : Math.round((completedModules / totalModules) * 100);

      return successResponse(
        res,
        { courseProgress, totalModules, completedModules, percent },
        "Course progress fetched",
        200
      );
    } catch (err) {
      console.error("Error occured in getCourseProgress: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };
}

module.exports = new CoursesControllers();
