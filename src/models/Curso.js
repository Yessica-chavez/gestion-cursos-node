const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Curso extends Model {}

Curso.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Curso',
  tableName: 'cursos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Curso; 