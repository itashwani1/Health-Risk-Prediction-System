'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, ArrowRight, Calendar, TrendingDown, TrendingUp, Minus, Trash2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface Prediction {
  id: string
  created_at: string
  risk_score: number
  risk_level: string
  age: number
  bmi: number
  systolic_bp: number
  diastolic_bp: number
  cholesterol: number
  glucose: number
  smoking_status: string
  physical_activity: string
}

const riskColors = {
  low: 'bg-success text-success-foreground',
  moderate: 'bg-warning text-warning-foreground',
  elevated: 'bg-chart-4 text-foreground',
  high: 'bg-destructive text-destructive-foreground'
}

export default function HistoryPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchPredictions = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching predictions:', error)
      } else {
        setPredictions(data || [])
      }
      setLoading(false)
    }

    fetchPredictions()
  }, [router, supabase])

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const { error } = await supabase.from('predictions').delete().eq('id', id)
    
    if (!error) {
      setPredictions(predictions.filter(p => p.id !== id))
    }
    setDeleting(null)
  }

  const chartData = [...predictions]
    .reverse()
    .map(p => ({
      date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: p.risk_score
    }))

  const chartConfig = {
    score: {
      label: 'Risk Score',
      color: 'hsl(var(--primary))'
    }
  }

  // Calculate trend
  const getTrend = () => {
    if (predictions.length < 2) return null
    const latest = predictions[0].risk_score
    const previous = predictions[1].risk_score
    const diff = latest - previous
    
    if (diff < -5) return { direction: 'down', value: Math.abs(diff), label: 'Improving' }
    if (diff > 5) return { direction: 'up', value: diff, label: 'Increasing' }
    return { direction: 'stable', value: 0, label: 'Stable' }
  }

  const trend = getTrend()

  const getRiskColorHex = (level: string) => {
    switch (level) {
      case 'low': return '#10B981'
      case 'moderate': return '#F59E0B'
      case 'elevated': return '#F97316'
      case 'high': return '#EF4444'
      default: return '#10B981'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto py-12 px-6 lg:px-12">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight gradient-text">Assessment History</h1>
            <p className="mt-2 text-slate-400">Track your health evolution over time</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 font-bold">
            <Link href="/">
              New Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-32 w-full bg-white/5" />
              ))}
            </div>
            <Skeleton className="h-64 w-full bg-white/5" />
          </div>
        ) : predictions.length === 0 ? (
          <div className="glass-card py-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10">
              <Activity className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold">No Assessments Yet</h3>
            <p className="mt-2 text-slate-400 max-w-md mx-auto">
              Complete your first health risk assessment to start tracking your progress.
            </p>
            <Button className="mt-8 bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/">
                Start Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-white/10 bg-white/5 border-l-4 border-l-blue-500 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardDescription className="text-slate-400 font-medium">Latest Score</CardDescription>
                  <CardTitle className="text-4xl font-black">{predictions[0].risk_score}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={`${riskColors[predictions[0].risk_level as keyof typeof riskColors]} font-bold uppercase tracking-wider text-[10px]`}>
                    {predictions[0].risk_level} Risk
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 border-l-4 border-l-emerald-500 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardDescription className="text-slate-400 font-medium">Total Reports</CardDescription>
                  <CardTitle className="text-4xl font-black">{predictions.length}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Started {new Date(predictions[predictions.length - 1].created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </CardContent>
              </Card>

              <Card className={`border-white/10 bg-white/5 border-l-4 overflow-hidden ${trend?.direction === 'down' ? 'border-l-emerald-500' : trend?.direction === 'up' ? 'border-l-red-500' : 'border-l-slate-500'}`}>
                <CardHeader className="pb-2">
                  <CardDescription className="text-slate-400 font-medium">Risk Trend</CardDescription>
                  <CardTitle className="flex items-center gap-3 text-4xl font-black">
                    {trend ? (
                      <>
                        {trend.direction === 'down' && <TrendingDown className="h-8 w-8 text-emerald-400" />}
                        {trend.direction === 'up' && <TrendingUp className="h-8 w-8 text-red-400" />}
                        {trend.direction === 'stable' && <Minus className="h-8 w-8 text-slate-400" />}
                        <span className={trend.direction === 'down' ? 'text-emerald-400' : trend.direction === 'up' ? 'text-red-400' : ''}>
                          {trend.label}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl text-slate-500 uppercase tracking-tighter">Need more data</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {trend && trend.value > 0 && (
                    <p className="text-sm text-slate-400">
                      {trend.direction === 'down' ? 'Dropped' : 'Increased'} by {trend.value} points
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Trend Chart */}
            {predictions.length >= 2 && (
              <Card className="border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Visual Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-64 w-full">
                    <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <ChartTooltip content={<ChartTooltipContent className="bg-slate-900 border-white/10" />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3b82f6"
                        strokeWidth={4}
                        dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#020617' }}
                        activeDot={{ r: 8, fill: '#60a5fa' }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

            {/* Timeline View Upgrade */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-6">Recent Assessments</h2>
              <div className="space-y-4">
                {predictions.map((prediction) => {
                  const riskColor = getRiskColorHex(prediction.risk_level)
                  const date = new Date(prediction.created_at)
                  
                  return (
                    <div 
                      key={prediction.id} 
                      className="group relative flex items-center gap-6 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                      style={{ borderLeft: `4px solid ${riskColor}` }}
                    >
                      {/* Left: Date */}
                      <div className="flex flex-col min-w-[80px] text-center border-r border-white/10 pr-6">
                        <span className="text-lg font-black uppercase text-white">
                          {date.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {date.getDate()}, {date.getFullYear()}
                        </span>
                      </div>

                      {/* Center: Small Gauge */}
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                        <svg className="h-14 w-14 -rotate-90">
                          <circle cx="28" cy="28" r="24" stroke="#1e293b" strokeWidth="4" fill="transparent" />
                          <circle 
                            cx="28" 
                            cy="28" 
                            r="24" 
                            stroke={riskColor} 
                            strokeWidth="4" 
                            fill="transparent"
                            strokeDasharray={150}
                            strokeDashoffset={150 - (prediction.risk_score / 100 * 150)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-sm font-black">{prediction.risk_score}</span>
                      </div>

                      {/* Right: Info Chips */}
                      <div className="flex-1 flex flex-wrap items-center gap-3">
                        <Badge className={`${riskColors[prediction.risk_level as keyof typeof riskColors]} font-bold text-[10px] uppercase px-3 py-1`}>
                          {prediction.risk_level}
                        </Badge>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: 'BP', value: `${prediction.systolic_bp}/${prediction.diastolic_bp}` },
                            { label: 'BMI', value: prediction.bmi.toFixed(1) },
                            { label: 'GLU', value: prediction.glucose }
                          ].map(chip => (
                            <div key={chip.label} className="flex items-center bg-slate-900 rounded-full px-3 py-1 border border-white/5">
                              <span className="text-[10px] font-bold text-slate-500 mr-2 uppercase">{chip.label}</span>
                              <span className="text-xs font-bold text-slate-300">{chip.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(prediction.id)}
                        disabled={deleting === prediction.id}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
