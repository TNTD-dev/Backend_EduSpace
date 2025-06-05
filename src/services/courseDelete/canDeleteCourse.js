import db from "../../models/index";

// Nên thêm kiểm tra các điều kiện trước khi xóa
const canDeleteCourse = async (course) => {
  // Kiểm tra nếu course đã có học viên
  const hasStudents = await db.CoursesEnrollments.findOne({
    where: { courseId: course.id },
  });
  if (hasStudents) {
    return {
      canDelete: false,
      message: "Cannot delete course with enrolled students",
    };
  }

  // Kiểm tra nếu course đã bắt đầu
  if (course.startDate && new Date(course.startDate) < new Date()) {
    return {
      canDelete: false,
      message: "Cannot delete course that has already started",
    };
  }

  return { canDelete: true };
};
