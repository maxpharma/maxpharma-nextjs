import { QueryInterface } from 'sequelize'
import { contactAttributes } from './attributes'

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('contacts', contactAttributes)
}

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('contacts')
}

export { up, down }