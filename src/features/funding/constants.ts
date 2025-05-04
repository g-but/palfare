import { FundingData } from './types'

const defaultMission = {
  title: 'Orange Cat',
  description: 'Building the Future of AI',
  problem: 'The current AI landscape lacks transparency and community-driven development.',
  solution: 'Creating an open-source AI development platform with full transparency and community governance.'
}

export const defaultData: FundingData = {
  mission: defaultMission,
  transparency: {
    financial: 100,
    operational: 100,
    governance: 100,
    impact: 100
  }
} 