"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable("Friends", {
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
          },
          friendId: {
            type: Sequelize.UUID,
            allowNull: false,
          },
          isPending: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            default: false,
          },
          isAccepted: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            default: false,
          },
          isBlocked: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            default: false,
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
    return queryInterface.dropTable("Friends");
  },
};
