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
import { Activity, Heart, Droplets, Scale, Cigarette, User } from 'lucide-react'

interface HealthRiskFormProps {
  onSubmit: (data: HealthData) => void
  isLoading?: boolean
}

export function HealthRiskForm({ onSubmit, isLoading }: HealthRiskFormProps) {
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
    onSubmit(formData)
  }

  const updateField = <K extends keyof HealthData>(field: K, value: HealthData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </div>
          <CardDescription>Basic demographic information</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input
              id="age"
              type="number"
              min={18}
              max={100}
              value={formData.age}
              onChange={(e) => updateField('age', parseInt(e.target.value) || 18)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(v) => updateField('gender', v as 'male' | 'female')}>
              <SelectTrigger id="gender">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blood Pressure */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive" />
            <CardTitle className="text-lg">Blood Pressure</CardTitle>
          </div>
          <CardDescription>Enter your blood pressure readings (mmHg)</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="systolic">Systolic (top number)</Label>
            <Input
              id="systolic"
              type="number"
              min={70}
              max={200}
              value={formData.systolicBP}
              onChange={(e) => updateField('systolicBP', parseInt(e.target.value) || 120)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diastolic">Diastolic (bottom number)</Label>
            <Input
              id="diastolic"
              type="number"
              min={40}
              max={130}
              value={formData.diastolicBP}
              onChange={(e) => updateField('diastolicBP', parseInt(e.target.value) || 80)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cholesterol */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-chart-3" />
            <CardTitle className="text-lg">Cholesterol Levels</CardTitle>
          </div>
          <CardDescription>Enter your cholesterol readings (mg/dL)</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="cholesterol">Total Cholesterol</Label>
            <Input
              id="cholesterol"
              type="number"
              min={100}
              max={400}
              value={formData.cholesterol}
              onChange={(e) => updateField('cholesterol', parseInt(e.target.value) || 200)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hdl">HDL (Good)</Label>
            <Input
              id="hdl"
              type="number"
              min={20}
              max={100}
              value={formData.hdlCholesterol}
              onChange={(e) => updateField('hdlCholesterol', parseInt(e.target.value) || 50)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ldl">LDL (Bad)</Label>
            <Input
              id="ldl"
              type="number"
              min={50}
              max={250}
              value={formData.ldlCholesterol}
              onChange={(e) => updateField('ldlCholesterol', parseInt(e.target.value) || 100)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Blood Glucose & BMI */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-chart-4" />
            <CardTitle className="text-lg">Metabolic Indicators</CardTitle>
          </div>
          <CardDescription>Blood glucose and body mass index</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="glucose">Fasting Blood Glucose (mg/dL)</Label>
            <Input
              id="glucose"
              type="number"
              min={50}
              max={300}
              value={formData.glucose}
              onChange={(e) => updateField('glucose', parseInt(e.target.value) || 95)}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="bmi">BMI</Label>
              <span className="text-sm font-medium text-muted-foreground">{formData.bmi.toFixed(1)}</span>
            </div>
            <Slider
              id="bmi"
              min={15}
              max={45}
              step={0.1}
              value={[formData.bmi]}
              onValueChange={([v]) => updateField('bmi', v)}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="diabetes">Diagnosed with Diabetes</Label>
              <p className="text-sm text-muted-foreground">Do you have a diabetes diagnosis?</p>
            </div>
            <Switch
              id="diabetes"
              checked={formData.diabetes}
              onCheckedChange={(v) => updateField('diabetes', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Factors */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-success" />
            <CardTitle className="text-lg">Lifestyle Factors</CardTitle>
          </div>
          <CardDescription>Smoking status and physical activity level</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="smoking" className="flex items-center gap-2">
              <Cigarette className="h-4 w-4" />
              Smoking Status
            </Label>
            <Select value={formData.smokingStatus} onValueChange={(v) => updateField('smokingStatus', v as HealthData['smokingStatus'])}>
              <SelectTrigger id="smoking">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never Smoked</SelectItem>
                <SelectItem value="former">Former Smoker</SelectItem>
                <SelectItem value="current">Current Smoker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity">Physical Activity Level</Label>
            <Select value={formData.physicalActivity} onValueChange={(v) => updateField('physicalActivity', v as HealthData['physicalActivity'])}>
              <SelectTrigger id="activity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                <SelectItem value="light">Light (1-2 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                <SelectItem value="active">Active (6-7 days/week)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Family History */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Family History</CardTitle>
          <CardDescription>History of cardiovascular disease in immediate family</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="family-history">Family History of Heart Disease</Label>
              <p className="text-sm text-muted-foreground">
                Parent or sibling with heart disease before age 55 (male) or 65 (female)
              </p>
            </div>
            <Switch
              id="family-history"
              checked={formData.familyHistory}
              onCheckedChange={(v) => updateField('familyHistory', v)}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? 'Calculating Risk...' : 'Calculate Health Risk'}
      </Button>
    </form>
  )
}
