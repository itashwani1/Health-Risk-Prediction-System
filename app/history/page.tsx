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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assessment History</h1>
            <p className="mt-1 text-muted-foreground">Track your health risk over time</p>
          </div>
          <Button asChild>
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
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        ) : predictions.length === 0 ? (
          <Card className="py-12 text-center">
            <CardContent>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No Assessments Yet</h3>
              <p className="mt-1 text-muted-foreground">
                Complete your first health risk assessment to start tracking your progress.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/">
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Latest Risk Score</CardDescription>
                  <CardTitle className="text-3xl">{predictions[0].risk_score}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={riskColors[predictions[0].risk_level as keyof typeof riskColors]}>
                    {predictions[0].risk_level.charAt(0).toUpperCase() + predictions[0].risk_level.slice(1)} Risk
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Assessments</CardDescription>
                  <CardTitle className="text-3xl">{predictions.length}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Since {new Date(predictions[predictions.length - 1].created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Trend</CardDescription>
                  <CardTitle className="flex items-center gap-2 text-3xl">
                    {trend ? (
                      <>
                        {trend.direction === 'down' && <TrendingDown className="h-8 w-8 text-success" />}
                        {trend.direction === 'up' && <TrendingUp className="h-8 w-8 text-destructive" />}
                        {trend.direction === 'stable' && <Minus className="h-8 w-8 text-muted-foreground" />}
                        {trend.label}
                      </>
                    ) : (
                      <span className="text-lg text-muted-foreground">Need more data</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {trend && trend.value > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {trend.direction === 'down' ? 'Decreased' : 'Increased'} by {trend.value} points
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Trend Chart */}
            {predictions.length >= 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Risk Score Over Time</CardTitle>
                  <CardDescription>Track how your health risk has changed</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-64 w-full">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

            {/* History Table */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment History</CardTitle>
                <CardDescription>Detailed records of all your assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>BP</TableHead>
                        <TableHead>BMI</TableHead>
                        <TableHead>Glucose</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {predictions.map((prediction) => (
                        <TableRow key={prediction.id}>
                          <TableCell className="font-medium">
                            {new Date(prediction.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>{prediction.risk_score}</TableCell>
                          <TableCell>
                            <Badge className={riskColors[prediction.risk_level as keyof typeof riskColors]}>
                              {prediction.risk_level.charAt(0).toUpperCase() + prediction.risk_level.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{prediction.systolic_bp}/{prediction.diastolic_bp}</TableCell>
                          <TableCell>{prediction.bmi.toFixed(1)}</TableCell>
                          <TableCell>{prediction.glucose}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(prediction.id)}
                              disabled={deleting === prediction.id}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete assessment</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
