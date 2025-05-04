import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/lib/utils'

interface FundingPage {
  id: string
  title: string
  description: string
  raised: number
  goal: number
  donors: number
  createdAt: string
}

interface FundingPageListProps {
  pages: FundingPage[]
  className?: string
}

export function FundingPageList({ pages, className }: FundingPageListProps) {
  return (
    <Card className={cn('space-y-4', className)}>
      <CardHeader>
        <CardTitle>Funding Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pages.map((page) => (
            <Card key={page.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{page.title}</h3>
                  <p className="text-sm text-muted-foreground">{page.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Raised: ${page.raised.toLocaleString()}</span>
                  <span>Goal: ${page.goal.toLocaleString()}</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(page.raised / page.goal) * 100}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>{page.donors} donors</span>
                  <span>{new Date(page.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 