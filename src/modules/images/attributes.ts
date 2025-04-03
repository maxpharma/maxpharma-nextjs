import {DataTypes} from 'sequelize'

const imageAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    galleryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'galleries',
            key: 'id',
            as: 'gallery',
            index:true
        },
        onDelete: 'CASCADE',
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'Gallery'
    },
    file: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}
export {imageAttributes}