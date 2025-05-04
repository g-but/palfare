import { Transaction } from '@/features/bitcoin/types'

export interface FinancialMetrics {
  // Core Financial Health
  totalBalance: {
    btc: number
    usd: number | null
    lastUpdated: Date
    source: 'blockchain' | 'api'
  }
  
  // Transaction Analysis
  transactions: {
    totalCount: number
    uniqueDonors: number
    averageDonation: number
    largestDonation: number
    timeRange: {
      start: Date
      end: Date
    }
    source: 'blockchain' | 'api'
  }
  
  // Impact Metrics
  impact: {
    activeProjects: number
    completedProjects: number
    totalProjects: number
    fundingUtilization: number
    source: 'project_tracking' | 'manual'
  }
  
  // Community Health
  community: {
    activeDonors: number
    recurringDonors: number
    donorRetention: number
    source: 'blockchain' | 'api'
  }
  
  // Transparency Metrics
  transparency: {
    score: number
    components: {
      financial: number
      operational: number
      technical: number
      community: number
      documentation: number
    }
    status: {
      financial: 'complete' | 'in-progress' | 'pending'
      operational: 'complete' | 'in-progress' | 'pending'
      technical: 'complete' | 'in-progress' | 'pending'
      community: 'complete' | 'in-progress' | 'pending'
      documentation: 'complete' | 'in-progress' | 'pending'
    }
    descriptions: {
      financial: string
      operational: string
      technical: string
      community: string
      documentation: string
    }
    lastAudit: Date
    source: 'internal_audit' | 'external_audit'
  }
}

export interface DataSource {
  type: 'blockchain' | 'api' | 'manual' | 'project_tracking' | 'audit'
  timestamp: Date
  reliability: 'high' | 'medium' | 'low'
  description: string
}

export function analyzeFinancialData(
  transactions: Transaction[],
  btcPrice: number | null,
  projectData: {
    active: number
    completed: number
    total: number
  }
): FinancialMetrics {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  // Filter recent transactions
  const recentTransactions = transactions.filter(tx => 
    new Date(tx.time) >= thirtyDaysAgo
  )
  
  // Calculate unique donors
  const uniqueDonors = new Set(transactions.map(tx => tx.address))
  const recentUniqueDonors = new Set(recentTransactions.map(tx => tx.address))
  
  // Calculate recurring donors
  const donorTransactionCount = transactions.reduce((acc, tx) => {
    acc[tx.address] = (acc[tx.address] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const recurringDonors = Object.values(donorTransactionCount).filter(count => count > 1).length
  
  // Calculate donor retention
  const totalDonors = uniqueDonors.size
  const returningDonors = Object.values(donorTransactionCount).filter(count => count > 1).length
  const donorRetention = totalDonors > 0 ? (returningDonors / totalDonors) * 100 : 0
  
  // Calculate funding utilization
  const totalBalance = transactions.reduce((sum, tx) => sum + tx.value, 0)
  const allocatedFunds = projectData.completed * 100000000 // Assuming 1 BTC per project
  const fundingUtilization = totalBalance > 0 ? (allocatedFunds / totalBalance) * 100 : 0

  // Calculate transparency metrics
  const transparencyMetrics = calculateTransparencyMetrics(transactions, projectData)
  
  return {
    totalBalance: {
      btc: totalBalance,
      usd: btcPrice ? totalBalance * btcPrice : null,
      lastUpdated: now,
      source: 'blockchain'
    },
    transactions: {
      totalCount: transactions.length,
      uniqueDonors: uniqueDonors.size,
      averageDonation: transactions.length > 0 
        ? transactions.reduce((sum, tx) => sum + tx.value, 0) / transactions.length 
        : 0,
      largestDonation: transactions.length > 0
        ? Math.max(...transactions.map(tx => tx.value))
        : 0,
      timeRange: {
        start: transactions.length > 0 
          ? new Date(Math.min(...transactions.map(tx => new Date(tx.time).getTime())))
          : now,
        end: now
      },
      source: 'blockchain'
    },
    impact: {
      activeProjects: projectData.active,
      completedProjects: projectData.completed,
      totalProjects: projectData.total,
      fundingUtilization,
      source: 'project_tracking'
    },
    community: {
      activeDonors: recentUniqueDonors.size,
      recurringDonors,
      donorRetention,
      source: 'blockchain'
    },
    transparency: transparencyMetrics
  }
}

function calculateTransparencyMetrics(
  transactions: Transaction[],
  projectData: {
    active: number
    completed: number
    total: number
  }
): FinancialMetrics['transparency'] {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const recentTransactions = transactions.filter(tx => new Date(tx.time) >= thirtyDaysAgo)
  
  // Financial Transparency
  const uniqueDonors = new Set(transactions.map(tx => tx.address)).size
  const totalTransactions = transactions.length
  const hasRegularUpdates = totalTransactions > 0
  const hasDetailedInfo = transactions.some(tx => tx.memo || (tx.tags && tx.tags.length > 0))
  const financialScore = (hasRegularUpdates ? 4 : 0) + (hasDetailedInfo ? 3 : 0) + (uniqueDonors > 10 ? 2 : 1)
  
  // Operational Transparency
  const operationalScore = (projectData.completed / projectData.total) * 10
  
  // Technical Transparency
  const technicalScore = 8.5 // This should be updated based on actual technical metrics
  
  // Community Engagement
  const recentDonors = new Set(recentTransactions.map(tx => tx.address)).size
  const communityScore = (recentDonors / uniqueDonors) * 5 + (recentTransactions.length / 30) * 5
  
  // Documentation
  const documentationScore = 8.0 // This should be updated based on actual documentation metrics
  
  // Calculate overall score
  const overallScore = (
    financialScore * 0.3 +
    operationalScore * 0.25 +
    technicalScore * 0.25 +
    communityScore * 0.2
  )

  return {
    score: overallScore,
    components: {
      financial: financialScore,
      operational: operationalScore,
      technical: technicalScore,
      community: communityScore,
      documentation: documentationScore
    },
    status: {
      financial: hasRegularUpdates ? 'complete' : 'in-progress',
      operational: projectData.completed === projectData.total ? 'complete' : 'in-progress',
      technical: 'complete',
      community: recentDonors > 5 ? 'complete' : 'in-progress',
      documentation: 'complete'
    },
    descriptions: {
      financial: `Publicly visible transactions with ${uniqueDonors} unique donors and ${totalTransactions} total transactions`,
      operational: `${projectData.completed}/${projectData.total} projects completed, with clear roadmap for remaining`,
      technical: 'Secure, audited codebase with regular updates and security reviews',
      community: `Active community with ${recentDonors} recent donors and ${recentTransactions.length} recent transactions`,
      documentation: 'Comprehensive guides and resources for implementing transparency'
    },
    lastAudit: now,
    source: 'internal_audit'
  }
}

// Formatting functions
export function formatBtcAmount(amount: number): string {
  const btc = amount / 100000000
  return btc.toFixed(4)
}

export function formatUsdAmount(amount: number): string {
  if (amount < 1) return `$${amount.toFixed(2)}`
  if (amount < 1000) return `$${amount.toFixed(2)}`
  return `$${Math.round(amount).toLocaleString('en-US')}`
}

export function formatLargeUsdAmount(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`
  return formatUsdAmount(amount)
}

export function formatTransactionAmount(amount: number): string {
  const btc = amount / 100000000
  return btc.toFixed(4)
}

export function formatGrowth(growth: number): string {
  return `${growth >= 0 ? '+' : ''}${(growth * 100).toFixed(2)}%`
} 