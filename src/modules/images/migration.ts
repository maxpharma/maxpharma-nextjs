import { QueryInterface } from 'sequelize'
import { imageAttributes } from './attributes'

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('images', imageAttributes)
}

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('images')
}

export { up, down }