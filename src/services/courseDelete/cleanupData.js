const { Transaction, where } = require("sequelize");
const transaction = Transaction;
import db from "../../models/index";
const cleanupData = async (courseId, transaction) => {
  // Xoa modules
  await db.Modules.destroy({ where: { courseId }, transaction });

  // Xoa resources
  await db.Resources.destroy({ where: { courseId }, transaction });

  // Xóa assignments
  await db.Assignments.destroy({
    where: { courseId },
    transaction,
  });

  // Xóa enrollments
  await db.CoursesEnrollments.destroy({
    where: { courseId },
    transaction,
  });
};
