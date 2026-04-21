'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { HealthRiskForm } from '@/components/health-risk-form'
import { RiskResults } from '@/components/risk-results'
import { Button } from '@/components/ui/button'
import { calculateHealthRisk, type HealthData, type HealthRiskResult } from '@/lib/health-risk'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, CheckCircle } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

export default function HomePage() {
  const [result, setResult] = useState<HealthRiskResult | null>(null)
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  const handleSubmit = async (data: HealthData) => {
    setIsCalculating(true)
    setSaved(false)
    
    // Simulate a brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const riskResult = calculateHealthRisk(data)
    setHealthData(data)
    setResult(riskResult)
    setIsCalculating(false)
  }

  const handleReset = () => {
    setResult(null)
    setHealthData(null)
    setSaved(false)
  }

  const handleSave = async () => {
    if (!user || !healthData || !result) return

    setIsSaving(true)
    try {
      const { error } = await supabase.from('predictions').insert({
        user_id: user.id,
        age: healthData.age,
        gender: healthData.gender,
        systolic_bp: healthData.systolicBP,
        diastolic_bp: healthData.diastolicBP,
        cholesterol: healthData.cholesterol,
        hdl_cholesterol: healthData.hdlCholesterol,
        ldl_cholesterol: healthData.ldlCholesterol,
        glucose: healthData.glucose,
        bmi: healthData.bmi,
        smoking_status: healthData.smokingStatus,
        physical_activity: healthData.physicalActivity,
        family_history: healthData.familyHistory,
        diabetes: healthData.diabetes,
        risk_score: result.overallRiskScore,
        risk_level: result.riskLevel
      })

      if (error) throw error
      setSaved(true)
    } catch (error) {
      console.error('Error saving prediction:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {!result ? (
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                Health Risk Assessment
              </h1>
              <p className="mt-3 text-lg text-muted-foreground text-pretty">
                Enter your health parameters below to receive a comprehensive cardiovascular and metabolic risk assessment.
              </p>
            </div>
            
            <HealthRiskForm onSubmit={handleSubmit} isLoading={isCalculating} />
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <Button variant="ghost" onClick={handleReset}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                New Assessment
              </Button>
              
              {user && (
                <Button
                  onClick={handleSave}
                  disabled={isSaving || saved}
                  variant={saved ? 'outline' : 'default'}
                >
                  {saved ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Saved to History
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? 'Saving...' : 'Save to History'}
                    </>
                  )}
                </Button>
              )}
              
              {!user && (
                <p className="text-sm text-muted-foreground">
                  <a href="/auth/login" className="text-primary hover:underline">Sign in</a> to save your results
                </p>
              )}
            </div>
            
            <RiskResults result={result} />
          </div>
        )}
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>HealthRisk AI - For informational purposes only. Consult a healthcare provider for medical advice.</p>
          <p className="mt-2">
            <a href="/index.html" className="text-primary hover:underline">View HTML/CSS/JS Version</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
