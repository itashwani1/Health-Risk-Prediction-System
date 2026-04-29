'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { HealthRiskResult, RiskFactor } from '@/lib/health-risk'
import { AlertTriangle, CheckCircle, Info, XCircle, TrendingUp, Stethoscope, ArrowRightCircle } from 'lucide-react'
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

const benchmarks: Record<string, string> = {
  'Blood Pressure': '< 120/80 mmHg',
  'Cholesterol': '< 200 mg/dL',
  'Blood Glucose': '70-99 mg/dL',
  'BMI': '18.5 - 24.9',
  'Smoking Status': 'Non-smoker',
  'Physical Activity': 'Moderate to Active',
  'Age': 'Lower risk < 45/55',
  'Family History': 'No history'
}

function RiskFactorCard({ factor }: { factor: RiskFactor }) {
  const StatusIcon = statusIcons[factor.status]
  const benchmark = benchmarks[factor.name]
  
  return (
    <div className={`group rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02] ${statusColors[factor.status]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4" />
            <h4 className="font-bold text-foreground">{factor.name}</h4>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">{factor.value}</span>
          </div>
          {benchmark && (
            <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-60">
              <span className="text-foreground/60">Target:</span>
              <span className="text-foreground">{benchmark}</span>
            </div>
          )}
        </div>
        <Badge variant="outline" className={`${statusColors[factor.status]} border-foreground/20 font-bold uppercase text-[10px]`}>
          {factor.status}
        </Badge>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{factor.recommendation}</p>
    </div>
  )
}

export function RiskResults({ result }: RiskResultsProps) {
  const { overallRiskScore, riskLevel, riskFactors, recommendations, summary } = result

  const getAIInsights = (level: string) => {
    switch (level) {
      case 'low':
        return {
          title: "Optimal Health Maintenance",
          content: "Your profile is excellent. To maintain this, focus on 'longevity habits': high-quality sleep (7-9h), stress management via mindfulness, and a diverse plant-forward diet. Your metrics suggest a strong cardiovascular foundation.",
          focus: "Preventative Longevity"
        }
      case 'moderate':
        return {
          title: "Early Intervention Strategy",
          content: "You're in a critical window where small lifestyle shifts yield 10x results. Focus on 'Zone 2' cardio (steady-state) to improve metabolic flexibility and consider reducing processed sugar intake to stabilize glucose spikes.",
          focus: "Metabolic Optimization"
        }
      case 'elevated':
        return {
          title: "Active Risk Mitigation",
          content: "Your metrics require proactive management. Prioritize sodium reduction (<2300mg/day) and increase soluble fiber. We recommend a clinical consultation to discuss if pharmacological support or structured lifestyle coaching is needed.",
          focus: "Clinical Consultation"
        }
      case 'high':
        return {
          title: "Priority Clinical Action",
          content: "Urgent attention is needed to address cumulative risks. Focus on immediate blood pressure and lipid control. Avoid high-intensity exertion until cleared by a physician. Small, consistent 10-minute walks are your best starting point.",
          focus: "Immediate Medical Review"
        }
      default:
        return { title: "", content: "", focus: "" }
    }
  }

  const aiInsight = getAIInsights(riskLevel)

  // Prepare chart data
  const contributionData = riskFactors
    .filter(f => f.contribution > 0)
    .map(f => ({
      name: f.name,
      contribution: f.contribution
    }))
    .sort((a, b) => b.contribution - a.contribution)

  const chartConfig = {
    contribution: {
      label: 'Risk Contribution',
      color: 'hsl(var(--primary))'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#10B981'
      case 'moderate': return '#F59E0B'
      case 'elevated': return '#F97316'
      case 'high': return '#EF4444'
      default: return '#10B981'
    }
  }

  const riskColor = getRiskColor(riskLevel)
  const circumference = 339 // 2 * pi * 54
  const strokeDashoffset = circumference - (overallRiskScore / 100 * (circumference / 2))

  return (
    <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Top Assessment Card - Image Match Upgrade */}
      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-foreground">Your Health Risk Assessment</CardTitle>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2 leading-relaxed">
            {summary}
          </p>
        </CardHeader>
        <CardContent className="pt-6 pb-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-24">
            
            {/* Left Column: Semi-Circle Gauge */}
            <div className="flex flex-col items-center">
              <div className="relative h-32 w-64">
                <svg viewBox="0 0 128 64" className="h-full w-full">
                  {/* Background Track */}
                  <path
                    d="M 10 64 A 54 54 0 0 1 118 64"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Progress Path */}
                   <path
                     d="M 10 64 A 54 54 0 0 1 118 64"
                     fill="none"
                     stroke="currentColor"
                     className="text-foreground"
                     strokeWidth="12"
                     strokeLinecap="round"
                     strokeDasharray="170"
                    style={{ 
                      strokeDashoffset: 170 - (overallRiskScore / 100 * 170),
                      transition: 'stroke-dashoffset 1.5s ease-in-out'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                  <span className="text-5xl font-bold text-foreground leading-none">{overallRiskScore}</span>
                  <span className="text-sm text-muted-foreground mt-1 font-medium">Risk Score</span>
                </div>
              </div>
            </div>

            {/* Right Column: Badge and Legend */}
            <div className="flex flex-col items-center md:items-start space-y-6">
              <div className={`
                px-8 py-3 text-xl font-bold rounded-xl text-center min-w-[200px]
                ${riskLevel === 'low' ? 'bg-[#10B981] text-white' : 
                  riskLevel === 'moderate' ? 'bg-[#D97706] text-white' : 
                  riskLevel === 'elevated' ? 'bg-[#F59E0B] text-white' : 
                  'bg-[#EF4444] text-white'}
              `}>
                {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
              </div>

              <div className="space-y-3 text-sm font-medium">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-[#10B981]" />
                  <span className="text-foreground">Low (0-19)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-[#D97706]" />
                  <span className="text-foreground">Moderate (20-39)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                  <span className="text-foreground">Elevated (40-59)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-[#EF4444]" />
                  <span className="text-foreground">High (60+)</span>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* AI Doctor Insights Upgrade - Premium Style */}
      <Card className="border-none bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden relative shadow-xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Stethoscope className="h-24 w-24 text-white" />
        </div>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">AI Medical Insights</CardTitle>
              <CardDescription className="text-blue-100/80 font-semibold uppercase text-[10px] tracking-widest">
                Deep Analysis • {aiInsight.focus}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <h4 className="text-lg font-bold text-white mb-3">{aiInsight.title}</h4>
          <p className="text-blue-50 leading-relaxed text-sm italic">
            "{aiInsight.content}"
          </p>
          <div className="mt-6 flex items-center gap-2 text-white text-xs font-bold uppercase cursor-pointer hover:text-blue-200 transition-colors">
            <span>Learn more about your profile</span>
            <ArrowRightCircle className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Timeline Upgrade */}
      {recommendations.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">Actionable Steps</CardTitle>
            <CardDescription className="text-muted-foreground">Prioritized recommendations for your health profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-8 ml-2">
              {/* Timeline Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
              
              {recommendations.map((rec, i) => (
                <div key={i} className="relative flex gap-6 items-start group">
                  <div 
                    className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-lg transition-transform group-hover:scale-110"
                    style={{ backgroundColor: riskColor }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">{rec}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Risk Contribution Chart */}
        {contributionData.length > 0 && (
          <Card className="border-border bg-card md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-foreground">Factor Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart data={contributionData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <XAxis type="number" domain={[0, 'dataMax']} hide />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12, fill: 'currentColor' }} className="text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent className="bg-popover border-border text-popover-foreground" />} />
                  <Bar dataKey="contribution" fill={riskColor} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Detailed Risk Factors */}
        {riskFactors.map((factor) => (
          <RiskFactorCard key={factor.name} factor={factor} />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="rounded-2xl border border-border bg-muted/50 p-6 backdrop-blur-sm">
        <div className="flex gap-4">
          <Info className="h-6 w-6 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Medical Disclaimer:</strong> This assessment is for informational purposes only. 
            It is based on general population data and may not reflect your individual clinical situation. 
            Always consult with a healthcare professional before making changes to your health regimen.
          </p>
        </div>
      </div>
    </div>
  )
}
