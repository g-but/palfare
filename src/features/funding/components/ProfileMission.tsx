import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { FundingData } from '../types'
import { defaultData } from '../constants'

interface ProfileMissionProps {
  data?: FundingData
  className?: string
}

export function ProfileMission({ data = defaultData, className }: ProfileMissionProps) {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">The Problem</h3>
            <p className="text-muted-foreground">{data.mission.problem}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Our Solution</h3>
            <p className="text-muted-foreground">{data.mission.solution}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 