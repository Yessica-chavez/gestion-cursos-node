const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Usuario extends Model {}

Usuario.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  clave: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Usuario; 