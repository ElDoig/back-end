import sequelize from '../config/database.js'
import { DataTypes } from 'sequelize'

const Tienda = sequelize.define('tienda', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Tienda;