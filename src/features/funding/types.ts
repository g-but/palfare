export interface Mission {
  title: string
  description: string
  problem: string
  solution: string
}

export interface TransparencyMetrics {
  financial: number
  operational: number
  governance: number
  impact: number
}

export interface FundingData {
  mission: Mission
  transparency: TransparencyMetrics
}

export interface FundingStats {
  donors: number
  raised: number
  projects: number
  balance: number
  btcPrice: number | null
} 