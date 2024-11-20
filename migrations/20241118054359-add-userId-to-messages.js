'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('messages', 'userId', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true, // Разрешаем NULL временно
    });

    // Шаг 2: Если у вас есть дефолтный пользователь, присваиваем его существующим сообщениям
    // Например, если у вас есть пользователь с id = 1
    await queryInterface.sequelize.query('UPDATE `messages` SET `userId` = 1 WHERE `userId` IS NULL');

    // Шаг 3: Теперь изменяем колонку, устанавливая allowNull: false и добавляем внешнее ключевое ограничение
    await queryInterface.changeColumn('messages', 'userId', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false, // Теперь запрещаем NULL
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('messages', 'userId');
  }
};
