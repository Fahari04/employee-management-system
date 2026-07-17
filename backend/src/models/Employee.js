'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Employee = sequelize.define(
    'Employee',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [2, 100],
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'on_leave'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      tableName: 'employees',
      timestamps: true,
      underscored: true,
    }
  );

  return Employee;
};
