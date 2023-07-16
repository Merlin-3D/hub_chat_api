"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable("Profiles", {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal("uuid_generate_v4()"),
            unique: true,
            primaryKey: true,
            allowNull: false,
          },
          userId: {
            type: Sequelize.UUID,
            allowNull: false,
            unique: true,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          username: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          phoneNumber: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
          },
          avatar: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          cover: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          createdAt: {
            type: "TIMESTAMP",
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: true,
          },
          updatedAt: {
            type: "TIMESTAMP",
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: true,
          },
        });
      });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("Profiles");
  },
};
