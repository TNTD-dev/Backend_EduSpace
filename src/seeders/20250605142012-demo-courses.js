'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Courses', [
      {
        // id: 1, // Có thể bỏ nếu để autoIncrement
        title: 'React Development',
        category: 'Programming',
        categoryColor: 'bg-blue-500',
        instructorId: 1,
        image: '/cover/cover-react.jpg',
        enrollCode: 'REACT2024', // Phải unique
        description: 'Learn React from scratch and build modern web applications.',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-06-30'),
        schedule: 'Monday, Wednesday 10:00 AM',
        status: 'current',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // id: 2,
        title: 'Introduction Software Engineering',
        category: 'SE',
        categoryColor: 'bg-[#9937fc]',
        instructorId: 2,
        image: '/cover/cover-software-engineer.jpg',
        enrollCode: 'SE2024',
        description: 'This course is designed to introduce students to the fundamentals of software engineering.',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        schedule: 'Monday, Wednesday, Friday',
        status: 'current',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Courses', null, {});
  }
}; 