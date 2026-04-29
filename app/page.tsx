'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { HealthRiskForm } from '@/components/health-risk-form'
import { RiskResults } from '@/components/risk-results'
import { Button } from '@/components/ui/button'
import { calculateHealthRisk, type HealthData, type HealthRiskResult } from '@/lib/health-risk'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, CheckCircle, Heart, Zap, Clock, BarChart3, Printer, Shield, Target, Users, ChevronRight, HelpCircle } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

export default function HomePage() {
  const [result, setResult] = useState<HealthRiskResult | null>(null)
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  const handlePrint = () => {
    window.print()
  }

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSubmit = async (data: HealthData) => {
    setIsCalculating(true)
    setSaved(false)
    
    // Simulate a brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const riskResult = calculateHealthRisk(data)
    setHealthData(data)
    setResult(riskResult)
    setIsCalculating(false)
  }

  const handleReset = () => {
    setResult(null)
    setHealthData(null)
    setSaved(false)
    setShowForm(false)
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
    <div className="min-h-screen bg-background text-foreground selection:bg-blue-500/30">
      <div className="no-print">
        <Header />
      </div>
      
      <main>
        {!result && !showForm ? (
          /* Section A: LANDING HERO */
          <div className="relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
              <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[120px]" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
              <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center py-24 text-center lg:py-40 px-6 lg:px-12">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-700">
                <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Trusted by 10k+ health enthusiasts</span>
              </div>
              
              <h1 className="max-w-5xl text-6xl font-black tracking-tighter sm:text-8xl lg:leading-[1.1] animate-in fade-in slide-in-from-top-8 duration-1000 text-foreground">
                Empowering Your <br />
                <span className="gradient-text">Health Journey</span>
              </h1>
              
              <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl animate-in fade-in slide-in-from-top-12 duration-1000 delay-200">
                Unlock deep medical insights with our AI-driven risk assessment. 
                Fast, secure, and built on the latest clinical guidelines to help you live longer.
              </p>

              <div className="mt-14 flex flex-wrap justify-center gap-6 animate-in fade-in slide-in-from-top-16 duration-1000 delay-500">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95"
                  onClick={() => setShowForm(true)}
                >
                  Start Assessment
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={scrollToFeatures}
                  className="h-14 px-10 text-lg font-bold border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  View Case Studies
                </Button>
              </div>

              {/* Floating Dashboard Preview Card */}
              <div id="features" className="mt-32 w-full max-w-7xl animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-700">
                <div className="relative rounded-3xl border border-border bg-card/50 p-4 backdrop-blur-2xl shadow-2xl">
                  <div className="flex flex-col h-full w-full rounded-2xl bg-background/80 overflow-hidden border border-border sm:h-[500px]">
                    {/* Mock Dashboard Header */}
                    <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-red-500/50" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                        <div className="h-3 w-3 rounded-full bg-green-500/50" />
                        <span className="ml-4 text-xs font-bold tracking-widest text-muted-foreground uppercase">Live AI Analysis Engine</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-1 border border-blue-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-blue-400 uppercase">Processing</span>
                      </div>
                    </div>

                    <div className="grid h-full lg:grid-cols-3">
                      {/* Left: Metrics */}
                      <div className="border-r border-border p-8 space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Biomarkers</h4>
                          {[
                            { label: "Glucose", val: "95 mg/dL", color: "bg-emerald-500" },
                            { label: "Systolic BP", val: "118 mmHg", color: "bg-blue-500" },
                            { label: "BMI", val: "22.4", color: "bg-emerald-500" },
                            { label: "LDL Chol.", val: "105 mg/dL", color: "bg-orange-500" }
                          ].map((m, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted border border-border hover:bg-accent transition-colors">
                              <span className="text-sm font-medium text-muted-foreground">{m.label}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-foreground">{m.val}</span>
                                <div className={`h-1.5 w-1.5 rounded-full ${m.color}`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Center: Main Visual */}
                      <div className="lg:col-span-2 p-8 flex flex-col items-center justify-center relative">
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-blue-500/5 blur-[80px] pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col items-center gap-6">
                          <div className="relative h-48 w-48 flex items-center justify-center">
                            {/* Outer Ring */}
                            <svg className="absolute inset-0 h-full w-full -rotate-90">
                              <circle cx="96" cy="96" r="80" stroke="currentColor" className="text-muted/20" strokeWidth="12" fill="transparent" />
                              <circle 
                                cx="96" cy="96" r="80" stroke="#3b82f6" strokeWidth="12" fill="transparent" 
                                strokeDasharray="502" strokeDashoffset="120" strokeLinecap="round"
                                className="animate-[dash_3s_ease-in-out_infinite]"
                              />
                            </svg>
                            <div className="flex flex-col items-center">
                              <span className="text-6xl font-black text-foreground">18</span>
                              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Optimal Score</span>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <h3 className="text-2xl font-bold mb-2 text-foreground">Comprehensive Protection</h3>
                            <p className="max-w-xs text-muted-foreground text-sm leading-relaxed mx-auto">
                              Our algorithm evaluates over 15+ biomarkers to give you a detailed breakdown of your health profile.
                            </p>
                          </div>
                        </div>

                        {/* Floating Metric Chips */}
                        <div className="absolute top-10 right-10 animate-bounce duration-[4000ms] hidden lg:block">
                          <div className="glass-card px-4 py-2 border-emerald-500/20 bg-emerald-500/5">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase">Heart Health: Good</span>
                          </div>
                        </div>
                        <div className="absolute bottom-10 left-10 animate-bounce duration-[5000ms] hidden lg:block">
                          <div className="glass-card px-4 py-2 border-blue-500/20 bg-blue-500/5">
                            <span className="text-[10px] font-bold text-blue-400 uppercase">Metabolic: Stable</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Decorative "Floaties" */}
                  <div className="absolute -top-10 -right-10 hidden sm:block">
                    <div className="glass-card p-4 animate-bounce duration-[3000ms] shadow-2xl border-border bg-card">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-muted-foreground uppercase">ACCURACY</p>
                          <p className="text-sm font-black text-foreground">99.4% Validated</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-32 grid w-full max-w-7xl gap-12 border-y border-border py-16 sm:grid-cols-3">
                {[
                  { label: "Assessments Run", value: "50k+", icon: Target },
                  { label: "Global Users", value: "12k+", icon: Users },
                  { label: "Data Accuracy", value: "99.2%", icon: Shield }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <stat.icon className="h-8 w-8 text-blue-500/50" />
                    <p className="text-5xl font-black text-foreground">{stat.value}</p>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Features Section */}
              <div className="mt-40 w-full text-left max-w-7xl">
                <div className="mb-16 text-center">
                  <h2 className="text-5xl font-bold tracking-tight sm:text-6xl mb-4 text-foreground">Why Choose HealthRisk AI?</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">We combine advanced data science with clinical research to provide actionable health intelligence.</p>
                </div>
                <div className="grid gap-8 sm:grid-cols-3">
                  {[
                    { icon: Zap, title: "Neural Analysis", desc: "Our proprietary AI models analyze cross-biomarker interactions that traditional tests miss." },
                    { icon: Clock, title: "Real-time Feedback", desc: "Receive your results and personalized recommendations in under 60 seconds." },
                    { icon: BarChart3, title: "Progressive Tracking", desc: "Visualize your health trends over months and years with our secure history engine." }
                  ].map((feature, i) => (
                    <div key={i} className="glass-card group p-10 hover:border-blue-500/30 transition-all duration-500 hover:bg-blue-500/[0.02] border-border bg-card">
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                        <feature.icon className="h-7 w-7 text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* How It Works */}
              <div id="how-it-works" className="mt-40 w-full max-w-7xl">
                <div className="mb-20 text-center">
                  <h2 className="text-5xl font-bold sm:text-6xl mb-4 text-foreground">How It Works</h2>
                  <p className="text-muted-foreground">Four simple steps to a clearer health future.</p>
                </div>
                <div className="relative grid gap-12 sm:grid-cols-4">
                  {/* Connector Line */}
                  <div className="absolute top-1/4 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent sm:block" />
                  
                  {[
                    { step: "01", title: "Input Metrics", desc: "Enter your vitals and lifestyle data." },
                    { step: "02", title: "AI Processing", desc: "Our models run complex risk simulations." },
                    { step: "03", title: "Instant Report", desc: "Get a detailed 100-point risk score." },
                    { step: "04", title: "Take Action", desc: "Follow clinical-grade recommendations." }
                  ].map((s, i) => (
                    <div key={i} className="relative flex flex-col items-center text-center group">
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-card border border-border text-2xl font-black text-blue-400 shadow-xl group-hover:scale-110 transition-transform">
                        {s.step}
                      </div>
                      <h4 className="text-2xl font-bold mb-2 text-foreground">{s.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div id="faq" className="mt-40 w-full max-w-6xl text-left">
                <div className="mb-16 text-center">
                  <h2 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3 text-foreground">
                    <HelpCircle className="h-12 w-12 text-blue-500/50" />
                    Common Questions
                  </h2>
                </div>
                <div className="space-y-4">
                  {[
                    { q: "Is my data secure?", a: "Yes, all data processing happens locally in your session. We use enterprise-grade encryption for anything saved to your account." },
                    { q: "How accurate is the AI model?", a: "Our models are trained on large-scale clinical datasets and show a high correlation with established medical risk scores." },
                    { q: "Do I need a doctor's referral?", a: "No, this is a screening tool designed for personal awareness. However, we always recommend discussing results with a professional." }
                  ].map((faq, i) => (
                    <details key={i} className="glass-card group overflow-hidden transition-all duration-300 open:bg-blue-500/[0.02] border-border bg-card">
                      <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-bold text-lg select-none text-foreground">
                        {faq.q}
                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-90" />
                      </summary>
                      <div className="p-6 pt-0 text-muted-foreground leading-relaxed border-t border-border">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-40 w-full overflow-hidden rounded-[40px] bg-blue-600 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500" />
                <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="relative z-10 px-8 py-20 text-center">
                  <h2 className="text-4xl font-black sm:text-5xl mb-6 text-white">Ready to prioritize your health?</h2>
                  <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">Join thousands of others taking control of their medical future today.</p>
                  <Button 
                    size="lg" 
                    className="h-16 px-12 text-xl font-bold bg-white text-blue-600 hover:bg-blue-50 shadow-2xl transition-all hover:scale-105 active:scale-95"
                    onClick={() => setShowForm(true)}
                  >
                    Get Started Now — It's Free
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : !result && showForm ? (
          /* Section B: HEALTH RISK FORM */
          <div className="container mx-auto py-20 px-6 lg:px-12">
            <div className="mx-auto max-w-2xl">
              <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-foreground">
                  Assessment
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Please provide accurate information for the best results.
                </p>
              </div>
              
              <HealthRiskForm onSubmit={handleSubmit} isLoading={isCalculating} />
            </div>
          </div>
        ) : (
          /* Section C: RISK RESULTS */
          <div className="container mx-auto py-20 px-6 lg:px-12">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 no-print">
                <Button variant="ghost" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  New Assessment
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePrint}
                    className="border-border bg-background hover:bg-accent"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print Report
                  </Button>

                  {user && (
                    <Button
                      onClick={handleSave}
                      disabled={isSaving || saved}
                      variant={saved ? 'outline' : 'default'}
                      className={saved ? 'border-border' : 'bg-blue-600 hover:bg-blue-700 text-white'}
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
                </div>
                
                {!user && (
                  <p className="text-sm text-muted-foreground">
                    <a href="/auth/login" className="text-blue-500 hover:underline">Sign in</a> to save your results
                  </p>
                )}
              </div>
              
              <RiskResults result={result!} />
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-border py-20 bg-muted/50 no-print">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid gap-12 sm:grid-cols-4 mb-16">
            <div className="sm:col-span-2">
              <h3 className="text-2xl font-black gradient-text mb-6">HealthRisk AI</h3>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                Empowering individuals with data-driven health insights. Built by a team of researchers and engineers committed to preventative medicine.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-foreground">Product</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Assessment</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">History</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-foreground">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground/60 pt-8 border-t border-border">
            <p>© 2026 HealthRisk AI. All rights reserved. For informational purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
