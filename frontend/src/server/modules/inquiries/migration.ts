import { QueryInterface } from 'sequelize'
import { inquiryAttributes } from './attributes'

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('inquiries', inquiryAttributes)
}

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('inquiries')
}

export { up, down }