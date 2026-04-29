'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import type { HealthData } from '@/lib/health-risk'
import { Activity, Heart, Droplets, Scale, Cigarette, User, ChevronRight, ChevronLeft } from 'lucide-react'

interface HealthRiskFormProps {
  onSubmit: (data: HealthData) => void
  isLoading?: boolean
}

export function HealthRiskForm({ onSubmit, isLoading }: HealthRiskFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<HealthData>({
    age: 35,
    gender: 'male',
    systolicBP: 120,
    diastolicBP: 80,
    cholesterol: 200,
    hdlCholesterol: 50,
    ldlCholesterol: 100,
    glucose: 95,
    bmi: 24,
    smokingStatus: 'never',
    physicalActivity: 'moderate',
    familyHistory: false,
    diabetes: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    } else {
      onSubmit(formData)
    }
  }

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const updateField = <K extends keyof HealthData>(field: K, value: HealthData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const stepInfo = [
    { title: "Personal Info", subtitle: "Basic demographic details" },
    { title: "Vitals", subtitle: "Blood pressure and labs" },
    { title: "Lifestyle", subtitle: "Daily habits and BMI" },
    { title: "History", subtitle: "Medical and family background" }
  ]

  return (
    <div className="space-y-8">
      {/* Step Counter & Progress Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm font-medium">
          <span className="text-blue-400">Step {currentStep} of 4</span>
          <span className="text-slate-400">{stepInfo[currentStep - 1].title}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div 
            style={{ width: `${(currentStep / 4) * 100}%` }} 
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold">{stepInfo[currentStep - 1].title}</h3>
          <p className="text-sm text-slate-400">{stepInfo[currentStep - 1].subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative min-h-[400px]">
        {/* Step 1: Personal */}
        {currentStep === 1 && (
          <div key="step1" className="animate-in fade-in-0 slide-in-from-right-4 duration-300 space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-slate-300">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    min={18}
                    max={100}
                    className="bg-slate-900/50 border-white/10 text-white"
                    value={formData.age}
                    onChange={(e) => updateField('age', parseInt(e.target.value) || 18)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-slate-300">Gender</Label>
                  <Select value={formData.gender} onValueChange={(v) => updateField('gender', v as 'male' | 'female')}>
                    <SelectTrigger id="gender" className="bg-slate-900/50 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Vitals */}
        {currentStep === 2 && (
          <div key="step2" className="animate-in fade-in-0 slide-in-from-right-4 duration-300 space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-400" />
                  <CardTitle className="text-lg text-white">Blood Pressure & Glucose</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="systolic" className="text-slate-300">Systolic (top number)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    min={70}
                    max={200}
                    className="bg-slate-900/50 border-white/10 text-white"
                    value={formData.systolicBP}
                    onChange={(e) => updateField('systolicBP', parseInt(e.target.value) || 120)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolic" className="text-slate-300">Diastolic (bottom number)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    min={40}
                    max={130}
                    className="bg-slate-900/50 border-white/10 text-white"
                    value={formData.diastolicBP}
                    onChange={(e) => updateField('diastolicBP', parseInt(e.target.value) || 80)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="glucose" className="text-slate-300">Fasting Blood Glucose (mg/dL)</Label>
                  <Input
                    id="glucose"
                    type="number"
                    min={50}
                    max={300}
                    className="bg-slate-900/50 border-white/10 text-white"
                    value={formData.glucose}
                    onChange={(e) => updateField('glucose', parseInt(e.target.value) || 95)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-lg text-white">Cholesterol Levels</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="cholesterol" className="text-slate-300">Total</Label>
                  <Input
                    id="cholesterol"
                    type="number"
                    min={100}
                    max={400}
                    className="bg-slate-900/50 border-white/10 text-white"
                    value={formData.cholesterol}
                    onChange={(e) => updateField('cholesterol', parseInt(e.target.value) || 200)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hdl" className="text-slate-300">HDL (Good)</Label>
                  <Input
                    id="hdl"
                    type="number"
                    min={20}
                    max={100}
                    className="bg-slate-900/50 border-white/10 text-white"
                    value={formData.hdlCholesterol}
                    onChange={(e) => updateField('hdlCholesterol', parseInt(e.target.value) || 50)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ldl" className="text-slate-300">LDL (Bad)</Label>
                  <Input
                    id="ldl"
                    type="number"
                    min={50}
                    max={250}
                    className="bg-slate-900/50 border-white/10 text-white"
                    value={formData.ldlCholesterol}
                    onChange={(e) => updateField('ldlCholesterol', parseInt(e.target.value) || 100)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Lifestyle */}
        {currentStep === 3 && (
          <div key="step3" className="animate-in fade-in-0 slide-in-from-right-4 duration-300 space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardContent className="space-y-8 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bmi" className="text-slate-300">BMI (Body Mass Index)</Label>
                    <span className="text-xl font-bold text-blue-400">{formData.bmi.toFixed(1)}</span>
                  </div>
                  <Slider
                    id="bmi"
                    min={15}
                    max={45}
                    step={0.1}
                    value={[formData.bmi]}
                    onValueChange={([v]) => updateField('bmi', v)}
                    className="py-4"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smoking" className="flex items-center gap-2 text-slate-300">
                      <Cigarette className="h-4 w-4 text-orange-400" />
                      Smoking Status
                    </Label>
                    <Select value={formData.smokingStatus} onValueChange={(v) => updateField('smokingStatus', v as HealthData['smokingStatus'])}>
                      <SelectTrigger id="smoking" className="bg-slate-900/50 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="never">Never Smoked</SelectItem>
                        <SelectItem value="former">Former Smoker</SelectItem>
                        <SelectItem value="current">Current Smoker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activity" className="text-slate-300">Physical Activity</Label>
                    <Select value={formData.physicalActivity} onValueChange={(v) => updateField('physicalActivity', v as HealthData['physicalActivity'])}>
                      <SelectTrigger id="activity" className="bg-slate-900/50 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Light (1-2 days)</SelectItem>
                        <SelectItem value="moderate">Moderate (3-5 days)</SelectItem>
                        <SelectItem value="active">Active (Daily)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: History */}
        {currentStep === 4 && (
          <div key="step4" className="animate-in fade-in-0 slide-in-from-right-4 duration-300 space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                  <div className="space-y-1">
                    <Label htmlFor="diabetes" className="text-white">Diagnosed with Diabetes</Label>
                    <p className="text-sm text-slate-400">Do you have a medical diagnosis?</p>
                  </div>
                  <Switch
                    id="diabetes"
                    checked={formData.diabetes}
                    onCheckedChange={(v) => updateField('diabetes', v)}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                  <div className="space-y-1">
                    <Label htmlFor="family-history" className="text-white">Family History</Label>
                    <p className="text-sm text-slate-400">Heart disease in parents or siblings?</p>
                  </div>
                  <Switch
                    id="family-history"
                    checked={formData.familyHistory}
                    onCheckedChange={(v) => updateField('familyHistory', v)}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            className={`px-6 text-slate-400 hover:text-white ${currentStep === 1 ? 'invisible' : ''}`}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {currentStep < 4 ? (
            <Button
              type="submit"
              className="px-8 bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="px-8 bg-emerald-600 hover:bg-emerald-700 min-w-[180px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Calculating...
                </div>
              ) : (
                'Calculate Risk'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
