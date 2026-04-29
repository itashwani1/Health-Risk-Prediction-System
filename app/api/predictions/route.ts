import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateHealthRisk, type HealthData } from '@/lib/health-risk'

export async function POST(request: NextRequest) {
  try {
    const data: HealthData = await request.json()

    // Validation
    const errors: string[] = []
    if (data.age < 18 || data.age > 100) errors.push("Age must be between 18 and 100")
    if (data.systolicBP < 70 || data.systolicBP > 200) errors.push("Systolic BP must be between 70 and 200")
    if (data.diastolicBP < 40 || data.diastolicBP > 130) errors.push("Diastolic BP must be between 40 and 130")
    if (data.bmi < 15 || data.bmi > 45) errors.push("BMI must be between 15 and 45")

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 })
    }

    // Calculate risk
    const riskResult = calculateHealthRisk(data)

    // Save if user is logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    let saved = false
    if (user) {
      const { error } = await supabase.from('predictions').insert({
        user_id: user.id,
        age: data.age,
        gender: data.gender,
        systolic_bp: data.systolicBP,
        diastolic_bp: data.diastolicBP,
        cholesterol: data.cholesterol,
        hdl_cholesterol: data.hdlCholesterol,
        ldl_cholesterol: data.ldlCholesterol,
        glucose: data.glucose,
        bmi: data.bmi,
        smoking_status: data.smokingStatus,
        physical_activity: data.physicalActivity,
        family_history: data.familyHistory,
        diabetes: data.diabetes,
        risk_score: riskResult.overallRiskScore,
        risk_level: riskResult.riskLevel
      })
      
      if (!error) saved = true
    }

    return NextResponse.json({ riskResult, saved })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: predictions, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ predictions })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}