'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { HealthRiskResult, RiskFactor } from '@/lib/health-risk'
import { AlertTriangle, CheckCircle, Info, XCircle, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface RiskResultsProps {
  result: HealthRiskResult
}

const riskColors = {
  low: 'bg-success text-success-foreground',
  moderate: 'bg-warning text-warning-foreground',
  elevated: 'bg-chart-4 text-foreground',
  high: 'bg-destructive text-destructive-foreground'
}

const riskChartColors = {
  low: 'hsl(var(--success))',
  moderate: 'hsl(var(--warning))',
  elevated: 'hsl(var(--chart-4))',
  high: 'hsl(var(--destructive))'
}

const statusColors = {
  optimal: 'bg-success/10 text-success border-success/20',
  borderline: 'bg-warning/10 text-warning border-warning/20',
  elevated: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20'
}

const statusIcons = {
  optimal: CheckCircle,
  borderline: Info,
  elevated: AlertTriangle,
  high: XCircle
}

function RiskFactorCard({ factor }: { factor: RiskFactor }) {
  const StatusIcon = statusIcons[factor.status]
  
  return (
    <div className={`rounded-lg border p-4 ${statusColors[factor.status]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4" />
            <h4 className="font-medium">{factor.name}</h4>
          </div>
          <p className="mt-1 text-sm opacity-90">{factor.value}</p>
        </div>
        <Badge variant="outline" className={statusColors[factor.status]}>
          {factor.status}
        </Badge>
      </div>
      <p className="mt-3 text-sm opacity-80">{factor.recommendation}</p>
    </div>
  )
}

export function RiskResults({ result }: RiskResultsProps) {
  const { overallRiskScore, riskLevel, riskFactors, recommendations, summary } = result

  // Prepare chart data
  const contributionData = riskFactors
    .filter(f => f.contribution > 0)
    .map(f => ({
      name: f.name,
      contribution: f.contribution
    }))
    .sort((a, b) => b.contribution - a.contribution)

  const riskGaugeData = [
    { name: 'Risk', value: overallRiskScore },
    { name: 'Remaining', value: 100 - overallRiskScore }
  ]

  const chartConfig = {
    contribution: {
      label: 'Risk Contribution',
      color: 'hsl(var(--primary))'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Your Health Risk Assessment</CardTitle>
          <CardDescription>{summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-around">
            {/* Risk Gauge */}
            <div className="relative h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskGaugeData}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    <Cell fill={riskChartColors[riskLevel]} />
                    <Cell fill="hsl(var(--muted))" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{overallRiskScore}</span>
                <span className="text-sm text-muted-foreground">Risk Score</span>
              </div>
            </div>

            {/* Risk Level Badge */}
            <div className="text-center">
              <Badge className={`mb-2 px-4 py-2 text-lg ${riskColors[riskLevel]}`}>
                {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
              </Badge>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-success" />
                  <span>Low (0-19)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-warning" />
                  <span>Moderate (20-39)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-chart-4" />
                  <span>Elevated (40-59)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <span>High (60+)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Contribution Chart */}
      {contributionData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Risk Factor Contributions</CardTitle>
            </div>
            <CardDescription>Factors contributing to your overall risk score</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart data={contributionData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <XAxis type="number" domain={[0, 'dataMax']} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="contribution" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Recommendations</CardTitle>
            <CardDescription>Prioritized actions to improve your health</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {i + 1}
                  </span>
                  <p className="text-muted-foreground">{rec}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Detailed Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Risk Factor Analysis</CardTitle>
          <CardDescription>Individual assessment of each health parameter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {riskFactors.map((factor) => (
              <RiskFactorCard key={factor.name} factor={factor} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-muted bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> This health risk assessment is for informational purposes only and should not be considered medical advice. 
              The results are based on general health guidelines and do not account for all individual factors. 
              Please consult with a qualified healthcare provider for personalized medical advice and treatment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
