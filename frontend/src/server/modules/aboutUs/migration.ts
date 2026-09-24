import { QueryInterface } from 'sequelize'
import { aboutUsAttributes } from './attributes'

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('about_us', aboutUsAttributes)
}

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('about_us')
}

export { up, down }