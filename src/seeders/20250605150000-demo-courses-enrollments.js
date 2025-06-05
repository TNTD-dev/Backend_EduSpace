'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('CoursesEnrollments', [
      {
        courseId: 2, // Khóa học React Development
        studentId: 1, // Giả sử user id=1 là student
        enrollmentDate: new Date('2024-03-01'),
        progress: 30,
        total: 100,
        grade: null,
        lastAccessed: new Date('2024-05-01'),
        completionDate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: 3, // Khóa học Software Engineering
        studentId: 1, // Cùng student tham gia 2 khóa
        enrollmentDate: new Date('2024-01-01'),
        progress: 28,
        total: 45,
        grade: 'A',
        lastAccessed: new Date('2024-01-30'),
        completionDate: new Date('2024-01-31'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CoursesEnrollments', null, {});
  }
}; 