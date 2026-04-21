export interface HealthData {
  age: number
  gender: 'male' | 'female'
  systolicBP: number
  diastolicBP: number
  cholesterol: number
  hdlCholesterol: number
  ldlCholesterol: number
  glucose: number
  bmi: number
  smokingStatus: 'never' | 'former' | 'current'
  physicalActivity: 'sedentary' | 'light' | 'moderate' | 'active'
  familyHistory: boolean
  diabetes: boolean
}

export interface RiskFactor {
  name: string
  value: number | string
  status: 'optimal' | 'borderline' | 'elevated' | 'high'
  contribution: number
  recommendation: string
}

export interface HealthRiskResult {
  overallRiskScore: number
  riskLevel: 'low' | 'moderate' | 'elevated' | 'high'
  riskFactors: RiskFactor[]
  recommendations: string[]
  summary: string
}

function calculateBPRisk(systolic: number, diastolic: number): { status: RiskFactor['status']; contribution: number; recommendation: string } {
  if (systolic < 120 && diastolic < 80) {
    return { status: 'optimal', contribution: 0, recommendation: 'Maintain your healthy blood pressure through regular exercise and a balanced diet.' }
  } else if (systolic < 130 && diastolic < 85) {
    return { status: 'borderline', contribution: 10, recommendation: 'Consider reducing sodium intake and increasing physical activity to prevent hypertension.' }
  } else if (systolic < 140 || diastolic < 90) {
    return { status: 'elevated', contribution: 20, recommendation: 'Consult with your healthcare provider about blood pressure management strategies.' }
  } else {
    return { status: 'high', contribution: 35, recommendation: 'Seek medical attention. High blood pressure significantly increases cardiovascular risk.' }
  }
}

function calculateCholesterolRisk(total: number, hdl: number, ldl: number): { status: RiskFactor['status']; contribution: number; recommendation: string } {
  const ratio = total / hdl
  if (ratio < 4 && ldl < 100) {
    return { status: 'optimal', contribution: 0, recommendation: 'Excellent cholesterol profile. Continue heart-healthy eating habits.' }
  } else if (ratio < 5 && ldl < 130) {
    return { status: 'borderline', contribution: 10, recommendation: 'Consider reducing saturated fats and increasing fiber intake.' }
  } else if (ratio < 6 || ldl < 160) {
    return { status: 'elevated', contribution: 20, recommendation: 'Dietary changes recommended. Consider consulting a healthcare provider.' }
  } else {
    return { status: 'high', contribution: 30, recommendation: 'High cholesterol levels detected. Medical evaluation and treatment may be necessary.' }
  }
}

function calculateGlucoseRisk(glucose: number, hasDiabetes: boolean): { status: RiskFactor['status']; contribution: number; recommendation: string } {
  if (hasDiabetes) {
    return { status: 'high', contribution: 25, recommendation: 'Continue diabetes management plan. Regular monitoring is essential.' }
  }
  if (glucose < 100) {
    return { status: 'optimal', contribution: 0, recommendation: 'Normal blood glucose levels. Maintain healthy eating habits.' }
  } else if (glucose < 126) {
    return { status: 'borderline', contribution: 15, recommendation: 'Prediabetic range. Lifestyle modifications can help prevent diabetes.' }
  } else {
    return { status: 'high', contribution: 25, recommendation: 'Elevated glucose levels. Please consult a healthcare provider for evaluation.' }
  }
}

function calculateBMIRisk(bmi: number): { status: RiskFactor['status']; contribution: number; recommendation: string } {
  if (bmi < 18.5) {
    return { status: 'borderline', contribution: 5, recommendation: 'Underweight. Consider consulting a nutritionist for healthy weight gain.' }
  } else if (bmi < 25) {
    return { status: 'optimal', contribution: 0, recommendation: 'Healthy weight. Maintain through balanced diet and regular exercise.' }
  } else if (bmi < 30) {
    return { status: 'elevated', contribution: 15, recommendation: 'Overweight. Weight management through diet and exercise is recommended.' }
  } else {
    return { status: 'high', contribution: 25, recommendation: 'Obesity increases health risks. Consider a structured weight loss program.' }
  }
}

function calculateSmokingRisk(status: HealthData['smokingStatus']): { status: RiskFactor['status']; contribution: number; recommendation: string } {
  switch (status) {
    case 'never':
      return { status: 'optimal', contribution: 0, recommendation: 'Non-smoker status is excellent for your health.' }
    case 'former':
      return { status: 'borderline', contribution: 10, recommendation: 'Great job quitting! Your risk continues to decrease over time.' }
    case 'current':
      return { status: 'high', contribution: 30, recommendation: 'Smoking significantly increases health risks. Quitting is the best thing you can do for your health.' }
  }
}

function calculateActivityRisk(activity: HealthData['physicalActivity']): { status: RiskFactor['status']; contribution: number; recommendation: string } {
  switch (activity) {
    case 'active':
      return { status: 'optimal', contribution: -5, recommendation: 'Excellent activity level. Keep up the great work!' }
    case 'moderate':
      return { status: 'optimal', contribution: 0, recommendation: 'Good activity level. Maintaining this helps reduce health risks.' }
    case 'light':
      return { status: 'borderline', contribution: 10, recommendation: 'Consider increasing physical activity to 150 minutes per week.' }
    case 'sedentary':
      return { status: 'elevated', contribution: 20, recommendation: 'Sedentary lifestyle increases health risks. Start with short daily walks.' }
  }
}

export function calculateHealthRisk(data: HealthData): HealthRiskResult {
  const riskFactors: RiskFactor[] = []
  
  // Blood Pressure
  const bpRisk = calculateBPRisk(data.systolicBP, data.diastolicBP)
  riskFactors.push({
    name: 'Blood Pressure',
    value: `${data.systolicBP}/${data.diastolicBP} mmHg`,
    status: bpRisk.status,
    contribution: bpRisk.contribution,
    recommendation: bpRisk.recommendation
  })
  
  // Cholesterol
  const cholRisk = calculateCholesterolRisk(data.cholesterol, data.hdlCholesterol, data.ldlCholesterol)
  riskFactors.push({
    name: 'Cholesterol',
    value: `${data.cholesterol} mg/dL (HDL: ${data.hdlCholesterol}, LDL: ${data.ldlCholesterol})`,
    status: cholRisk.status,
    contribution: cholRisk.contribution,
    recommendation: cholRisk.recommendation
  })
  
  // Blood Glucose
  const glucoseRisk = calculateGlucoseRisk(data.glucose, data.diabetes)
  riskFactors.push({
    name: 'Blood Glucose',
    value: `${data.glucose} mg/dL${data.diabetes ? ' (Diabetic)' : ''}`,
    status: glucoseRisk.status,
    contribution: glucoseRisk.contribution,
    recommendation: glucoseRisk.recommendation
  })
  
  // BMI
  const bmiRisk = calculateBMIRisk(data.bmi)
  riskFactors.push({
    name: 'BMI',
    value: data.bmi.toFixed(1),
    status: bmiRisk.status,
    contribution: bmiRisk.contribution,
    recommendation: bmiRisk.recommendation
  })
  
  // Smoking
  const smokingRisk = calculateSmokingRisk(data.smokingStatus)
  riskFactors.push({
    name: 'Smoking Status',
    value: data.smokingStatus.charAt(0).toUpperCase() + data.smokingStatus.slice(1),
    status: smokingRisk.status,
    contribution: smokingRisk.contribution,
    recommendation: smokingRisk.recommendation
  })
  
  // Physical Activity
  const activityRisk = calculateActivityRisk(data.physicalActivity)
  riskFactors.push({
    name: 'Physical Activity',
    value: data.physicalActivity.charAt(0).toUpperCase() + data.physicalActivity.slice(1),
    status: activityRisk.status,
    contribution: activityRisk.contribution,
    recommendation: activityRisk.recommendation
  })
  
  // Age factor
  let ageContribution = 0
  if (data.age >= 45 && data.gender === 'male') ageContribution = 10
  if (data.age >= 55 && data.gender === 'female') ageContribution = 10
  if (data.age >= 65) ageContribution = 15
  
  riskFactors.push({
    name: 'Age',
    value: `${data.age} years (${data.gender})`,
    status: ageContribution === 0 ? 'optimal' : ageContribution <= 10 ? 'borderline' : 'elevated',
    contribution: ageContribution,
    recommendation: ageContribution > 0 ? 'Age is a non-modifiable risk factor. Focus on controlling other risk factors.' : 'Your age is in a lower risk category.'
  })
  
  // Family History
  const familyContribution = data.familyHistory ? 15 : 0
  riskFactors.push({
    name: 'Family History',
    value: data.familyHistory ? 'Positive' : 'Negative',
    status: data.familyHistory ? 'elevated' : 'optimal',
    contribution: familyContribution,
    recommendation: data.familyHistory ? 'Family history increases risk. Regular screenings and healthy lifestyle are important.' : 'No significant family history reported.'
  })
  
  // Calculate overall risk score
  let totalContribution = riskFactors.reduce((sum, factor) => sum + factor.contribution, 0)
  totalContribution = Math.max(0, Math.min(100, totalContribution))
  
  // Determine risk level
  let riskLevel: HealthRiskResult['riskLevel']
  if (totalContribution < 20) {
    riskLevel = 'low'
  } else if (totalContribution < 40) {
    riskLevel = 'moderate'
  } else if (totalContribution < 60) {
    riskLevel = 'elevated'
  } else {
    riskLevel = 'high'
  }
  
  // Generate recommendations (top 3 actionable items)
  const recommendations = riskFactors
    .filter(f => f.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3)
    .map(f => f.recommendation)
  
  // Generate summary
  const summaryMap = {
    low: 'Your health risk assessment indicates a low overall risk. Continue maintaining your healthy lifestyle habits.',
    moderate: 'Your assessment shows moderate health risks. Consider addressing the highlighted factors to improve your health profile.',
    elevated: 'Your health risk is elevated. We recommend consulting with a healthcare provider to discuss risk reduction strategies.',
    high: 'Your assessment indicates high health risks. Please seek medical consultation to develop a comprehensive health management plan.'
  }
  
  return {
    overallRiskScore: totalContribution,
    riskLevel,
    riskFactors,
    recommendations,
    summary: summaryMap[riskLevel]
  }
}
