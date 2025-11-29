import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Usuario = sequelize.define(
  "usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    usuario: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "cliente",
    },
  },
  {
    tableName: "usuario",
    timestamps: false,
  }
);

export default Usuario;
