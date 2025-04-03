import { QueryInterface } from 'sequelize'
import { portfolioAttributes } from './attributes'

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('portfolios', portfolioAttributes)
}

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('portfolios')
}

export { up, down }