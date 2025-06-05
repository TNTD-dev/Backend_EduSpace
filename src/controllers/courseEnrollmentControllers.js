const db = require("../models/index");
// console.log(
//   "DB object state when courseEnrollmentControllers is required:",
//   Object.keys(db)
// );
const { successResponse, errorResponse } = require("../utils/responseHelper");
const crypto = require("crypto");
const { sendCourseInvitationEmail } = require("../utils/mailer");

const { where } = require("sequelize");

const { cursorTo } = require("readline");
const { stat } = require("fs");
const { getDefaultHighWaterMark } = require("stream");
const { count } = require("console");

/**
 * Get all courses that a student is enrolled in
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.studentId - ID of the student
 * @param {Object} req.query - Query parameters
 * @param {Object} res - Express response object
 * @returns {Object} Response object containing courses data
 */

class CourseEnrollmentControllers {
  getStudentOfCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
      const db = require("../models/index");
      const students = await db.CoursesEnrollments.findAll({
        where: { courseId },
        include: [
          {
            model: db.Users,
            as: "Students",
            attributes: ["id", "firstname", "lastname", "email"],
          },
        ],
      });

      return successResponse(res, students, "Successfully retrieved students");
    } catch (err) {
      console.log("Error occured in getStudentOfCourse: ", err);
      return errorResponse(res, "Internal server error", 500);
    }
  };
  getCoursesOfStudent = async (req, res) => {
    try {
      const db = require("../models/index");
      const { studentId } = req.params;

      // Validate studentId
      if (!studentId) {
        return errorResponse(res, "Student ID is required", 400);
      }

      // Check if student exists
      const student = await db.Users.findOne({
        where: { id: studentId, role: "student" },
      });
      if (!student) {
        return errorResponse(res, "Student not found", 404);
      }

      // Check permission
      if (req.user.id !== studentId && req.user.role !== "admin") {
        return errorResponse(res, "Forbidden", 403);
      }

      const courses = await db.CourseEnrollments.findAll({
        where: { studentId },
        include: [
          {
            model: db.Courses,
            as: "enrolledCourses",
            attributes: [
              "id",
              "title",
              "category",
              "image",
              "description",
              "status",
              "startDate",
              "endDate",
            ],
          },
          {
            model: db.Users,
            as: "instructedCourses",
            attributes: ["id", "firstname", "lastname"],
          },
        ],
      });

      if (!courses || courses.length === 0) {
        return successResponse(
          res,
          [],
          `No courses found for this student`,
          200
        );
      }

      return successResponse(
        res,
        courses,
        "Successfully retrieved courses",
        200
      );
    } catch (err) {
      console.error("Error in getCoursesOfStudent:", err);
      return errorResponse(res, "Internal server error", 500);
    }
  };

  enrollCourse = async (req, res) => {
    try {
      const db = require("../models/index");
      const studentId = req.user.id;
      const { courseId } = req.params;

      // Kiểm tra user là student
      const student = await db.Users.findOne({
        where: { id: studentId, role: "student" },
      });
      if (!student) {
        return errorResponse(res, "Not authorized to register", 403);
      }

      // Kiểm tra course tồn tại và trạng thái
      const course = await db.Courses.findOne({
        where: { id: courseId },
      });
      if (!course || course.status !== "current") {
        return errorResponse(res, "Course is not available", 400);
      }

      // Kiểm tra đã đăng ký chưa
      const existed = await db.CourseEnrollments.findOne({
        where: { studentId, courseId },
      });
      if (existed) {
        return errorResponse(
          res,
          "You have already enrolled in this course",
          400
        );
      }

      // Tạo mới enrollment
      const newEnrollment = await db.CourseEnrollments.create({
        studentId,
        courseId,
      });

      return successResponse(
        res,
        newEnrollment,
        "Registered successfully",
        201
      );
    } catch (err) {
      console.error("Error occured in enrollCourse", err);
      return errorResponse(res, "Internal server error", 500);
    }
  };

  enrollByCode = async (req, res) => {
    const db = require("../models/index");
    const { courseCode } = req.body;
    const studentId = req.user.id;
    // console.log("All models in db:", Object.keys(db));
    // console.log(db);
    console.log("Student id: ", studentId);
    console.log("Course code: ", courseCode);
    try {
      const validStudent = await db.Users.findOne({
        where: {
          id: studentId,
          role: "student",
        },
      });
      console.log("valid student: ", validStudent);

      if (!validStudent) {
        return errorResponse(res, "You are not authorized", 403);
      }

      const validCourse = await db.Courses.findOne({
        where: {
          enrollCode: courseCode,
        },
      });

      console.log("valid course: ", validCourse);

      if (!validCourse || validCourse.status !== "current") {
        return errorResponse(res, "Course is not available", 400);
      }

      const existed = await db.CoursesEnrollments.findOne({
        where: {
          courseId: validCourse.id,
          studentId,
        },
      });
      console.log("Existed: ", existed);

      if (!!existed) {
        return errorResponse(
          res,
          "You have already enrolled in this course",
          400
        );
      }

      const newEnrollment = await db.CoursesEnrollments.create({
        courseId: validCourse.id,
        studentId,
      });
      console.log("New enrollment: ", newEnrollment);

      return successResponse(res, newEnrollment, "Successfully enrolled", 201);
    } catch (err) {
      console.error("Error occured in enrollByCode", err);
      return errorResponse(res, "Internal server error", 500);
    }
  };

  enrollByInvitation = async (req, res) => {
    try {
      const db = require("../models/index");
      const { courseId } = req.params;
      const { studentEmail } = req.body;
      const instructorId = req.user.id;

      const instructor = await db.Users.findOne({
        where: { id: instructorId },
      });

      const instructorEmail = instructor.email;

      // 1. Kiểm tra quyền của Instructor
      const course = await db.Courses.findOne({ where: { id: courseId } });
      if (!course || course.instructorId !== instructorId) {
        return errorResponse(res, "Not authorized", 403);
      }

      // 2. Kiểm tra đã là học viên chưa
      const student = await db.Users.findOne({
        where: { email: studentEmail, role: "student" },
      });
      if (student) {
        const existed = await db.CoursesEnrollments.findOne({
          where: { courseId, studentId: student.id },
        });
        if (existed) {
          return errorResponse(
            res,
            "This student is already enrolled in the course",
            400
          );
        }
      }

      // 3. kiểm tra trùng lặp
      const exists = await db.Invitations.findOne({
        where: { courseId, email: studentEmail, status: "pending" },
      });

      if (exists) {
        return errorResponse(res, "Existed invitation", 400);
      }

      // 4. Sinh token
      const token = crypto.randomBytes(32).toString("hex");

      // 5. Luu invitation
      await db.Invitations.create({
        courseId,
        email: studentEmail,
        token,
        status: "pending",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      // 4. Gui email
      const inviteLink = `http://localhost:4003/api/coursesEnrollment/accept-invitation?token=${token}`;
      await sendCourseInvitationEmail(
        instructorEmail,
        studentEmail,
        course.title,
        inviteLink
      );

      return successResponse(res, null, "Invitation sent successfully", 200);
    } catch (err) {
      console.error("Error occured in enrollByInvitation", err);
      return errorResponse(res, "Internal server error", 500);
    }
  };

  acceptInvitation = async (req, res) => {
    try {
      const db = require("../models/index");
      const { token } = req.query;
      if (!token) {
        return errorResponse(res, "Token is required", 400);
      }

      const invitation = await db.Invitations.findOne({
        where: { token, status: "pending" },
      });

      if (!invitation) {
        return errorResponse(res, "Invalid or expired invitation", 400);
      }

      // Kiểm tra hết hạn
      if (invitation.expiresAt && invitation.expiresAt < new Date()) {
        return errorResponse(res, "Invitation has expired", 400);
      }

      const user = await db.Users.findOne({
        where: {
          email: invitation.email,
        },
      });

      if (user) {
        // kiểm tra xem đã log in chưa?
        if (req.user && req.user.email === user.email) {
          const existed = await db.CoursesEnrollments.findOne({
            where: {
              courseId: invitation.courseId,
              studentId: user.id,
            },
          });

          if (existed) {
            return successResponse(
              res,
              null,
              "You have already enrolled in this course",
              200
            );
          }

          await db.CoursesEnrollments.create({
            courseId: invitation.courseId,
            studentId: user.id,
          });

          invitation.status = "accepted";
          await invitation.save();
          return successResponse(
            res,
            null,
            "You have enrolled successfully",
            200
          );
        } else {
          // Sử dụng errorResponse hoặc một helper khác cho trường hợp này nếu muốn
          // Hoặc giữ nguyên cách này nếu bạn muốn custom response cho flow đăng nhập/đăng ký
          return res.status(200).json({
            action: "login",
            message: "Please login to accept the invitation",
            email: invitation.email,
            token,
          });
        }
      } else {
        // Sử dụng errorResponse hoặc một helper khác cho trường hợp này nếu muốn
        // Hoặc giữ nguyên cách này nếu bạn muốn custom response cho flow đăng nhập/đăng ký
        return res.status(200).json({
          action: "register",
          message: "Please sign up to join the course.",
          email: invitation.email,
          token,
        });
      }
    } catch (error) {
      console.error("Error occured in acceptInvitation: ", error);
      return errorResponse(res, "Internal server error", 500);
    }
  };

  deleteStudent = async (req, res) => {
    try {
      const db = require("../models/index");
      const { courseId, studentId } = req.params;
      const instructorId = req.user.id;

      const isPermitted = await db.Courses.findOne({
        where: {
          courseId: courseId,
          instructorId: instructorId,
        },
      });

      // check if instructor have rights or not
      if (!isPermitted) {
        return errorResponse(res, "Not Authorized", 403);
      }

      // check if is there student with studentId
      const belongedStudent = await db.CoursesEnrollments.findOne({
        where: {
          courseId: courseId,
          studentId: studentId,
        },
      });

      if (!belongedStudent) {
        return errorResponse(res, "Does Not Have Student", 400);
      }

      await db.CoursesEnrollments.destroy({
        where: {
          studentId: studentId,
          courseId: courseId,
        },
      });

      return successResponse(res, [], "Delete Student Successfully", 200);
    } catch (err) {
      console.error("Error occured in delete student", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  getMyCourses = async (req, res) => {
    try {
      const db = require("../models/index");
      const studentId = req.user.id;

      // Kiểm tra user có phải là student không
      const student = await db.Users.findOne({
        where: { id: studentId, role: "student" },
      });
      if (!student) {
        return errorResponse(res, "Student not found", 404);
      }

      // Lấy danh sách khóa học đã enroll
      const enrollments = await db.CoursesEnrollments.findAll({
        where: { studentId },
        include: [
          {
            model: db.Courses,
            as: "course",
            attributes: [
              "id",
              "title",
              "category",
              "categoryColor",
              "image",
              "description",
              "status",
              "startDate",
              "endDate",
            ],
          },
          {
            model: db.Users,
            as: "student",
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
      });

      // Trả về danh sách khóa học
      const courses = enrollments.map(e => ({
        ...e.course?.toJSON(),
        progress: e.progress,
        total: e.total,
      }));

      return successResponse(res, courses, "Successfully retrieved my courses", 200);
    } catch (err) {
      console.error("Error in getMyCourses:", err);
      return errorResponse(res, "Internal server error", 500);
    }
  };
}

module.exports = new CourseEnrollmentControllers();
