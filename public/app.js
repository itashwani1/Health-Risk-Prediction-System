// ========================================
// Theme Toggle (Dark Mode)
// ========================================
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialize theme from localStorage or system preference
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (systemDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

// Run theme initialization immediately
initTheme();

// ========================================
// Supabase Configuration
// ========================================
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Initialize Supabase client (will be set when env vars are available)
let supabase = null;

// Try to initialize Supabase if available
try {
  if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.log('Supabase not configured - running in demo mode');
}

// ========================================
// Global State
// ========================================
let currentUser = null;
let currentResults = null;

// ========================================
// DOM Elements
// ========================================
const healthForm = document.getElementById('health-form');
const resultsCard = document.getElementById('results-card');
const authModal = document.getElementById('auth-modal');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authButtons = document.getElementById('auth-buttons');
const userMenu = document.getElementById('user-menu');
const userEmailSpan = document.getElementById('user-email');

// ========================================
// Health Risk Calculation
// ========================================
function calculateBMI(height, weight) {
  const heightM = height / 100;
  return weight / (heightM * heightM);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return { category: 'Underweight', class: 'bmi-underweight' };
  if (bmi < 25) return { category: 'Normal', class: 'bmi-normal' };
  if (bmi < 30) return { category: 'Overweight', class: 'bmi-overweight' };
  return { category: 'Obese', class: 'bmi-obese' };
}

function calculateHealthRisk(data) {
  const factors = [];
  let totalScore = 0;

  // Age risk
  let ageRisk = 0;
  if (data.age >= 65) ageRisk = 30;
  else if (data.age >= 55) ageRisk = 20;
  else if (data.age >= 45) ageRisk = 10;
  else if (data.age >= 35) ageRisk = 5;
  factors.push({ name: 'Age', value: ageRisk, maxValue: 30 });
  totalScore += ageRisk;

  // Blood Pressure risk
  let bpRisk = 0;
  if (data.systolic >= 180 || data.diastolic >= 120) bpRisk = 30;
  else if (data.systolic >= 140 || data.diastolic >= 90) bpRisk = 20;
  else if (data.systolic >= 130 || data.diastolic >= 85) bpRisk = 10;
  else if (data.systolic >= 120) bpRisk = 5;
  factors.push({ name: 'Blood Pressure', value: bpRisk, maxValue: 30 });
  totalScore += bpRisk;

  // Cholesterol risk
  let cholesterolRisk = 0;
  if (data.cholesterol >= 280) cholesterolRisk = 25;
  else if (data.cholesterol >= 240) cholesterolRisk = 15;
  else if (data.cholesterol >= 200) cholesterolRisk = 8;
  factors.push({ name: 'Cholesterol', value: cholesterolRisk, maxValue: 25 });
  totalScore += cholesterolRisk;

  // Glucose risk
  let glucoseRisk = 0;
  if (data.glucose >= 200) glucoseRisk = 25;
  else if (data.glucose >= 140) glucoseRisk = 15;
  else if (data.glucose >= 100) glucoseRisk = 8;
  factors.push({ name: 'Glucose', value: glucoseRisk, maxValue: 25 });
  totalScore += glucoseRisk;

  // BMI risk
  const bmi = calculateBMI(data.height, data.weight);
  let bmiRisk = 0;
  if (bmi >= 35) bmiRisk = 20;
  else if (bmi >= 30) bmiRisk = 15;
  else if (bmi >= 25) bmiRisk = 8;
  else if (bmi < 18.5) bmiRisk = 5;
  factors.push({ name: 'BMI', value: bmiRisk, maxValue: 20 });
  totalScore += bmiRisk;

  // Lifestyle factors
  if (data.smoking) {
    factors.push({ name: 'Smoking', value: 20, maxValue: 20 });
    totalScore += 20;
  }

  if (data.alcohol) {
    factors.push({ name: 'Alcohol', value: 10, maxValue: 10 });
    totalScore += 10;
  }

  if (!data.active) {
    factors.push({ name: 'Physical Inactivity', value: 10, maxValue: 10 });
    totalScore += 10;
  }

  if (data.familyHistory) {
    factors.push({ name: 'Family History', value: 15, maxValue: 15 });
    totalScore += 15;
  }

  // Normalize score to 0-100
  const maxPossible = 185;
  const normalizedScore = Math.min(100, Math.round((totalScore / maxPossible) * 100));

  // Determine risk level
  let riskLevel, riskClass, riskDescription;
  if (normalizedScore < 30) {
    riskLevel = 'Low Risk';
    riskClass = 'risk-low';
    riskDescription = 'Your health metrics are within normal ranges. Keep up the good work with a healthy lifestyle!';
  } else if (normalizedScore < 60) {
    riskLevel = 'Moderate Risk';
    riskClass = 'risk-moderate';
    riskDescription = 'Some of your health metrics need attention. Consider lifestyle changes and consult a healthcare provider.';
  } else {
    riskLevel = 'High Risk';
    riskClass = 'risk-high';
    riskDescription = 'Multiple risk factors detected. Please consult a healthcare professional for a thorough evaluation.';
  }

  // Generate recommendations
  const recommendations = generateRecommendations(data, bmi, normalizedScore);

  return {
    score: normalizedScore,
    riskLevel,
    riskClass,
    riskDescription,
    factors: factors.filter(f => f.value > 0),
    recommendations,
    bmi: bmi.toFixed(1),
    data
  };
}

function generateRecommendations(data, bmi, score) {
  const recommendations = [];

  if (data.systolic >= 130 || data.diastolic >= 85) {
    recommendations.push('Monitor your blood pressure regularly and reduce sodium intake');
  }

  if (data.cholesterol >= 200) {
    recommendations.push('Limit saturated fats and increase fiber-rich foods in your diet');
  }

  if (data.glucose >= 100) {
    recommendations.push('Reduce sugar intake and consider regular blood glucose monitoring');
  }

  if (bmi >= 25) {
    recommendations.push('Work towards achieving a healthy weight through balanced diet and exercise');
  }

  if (data.smoking) {
    recommendations.push('Consider a smoking cessation program - this is the most impactful change you can make');
  }

  if (data.alcohol) {
    recommendations.push('Limit alcohol consumption to moderate levels');
  }

  if (!data.active) {
    recommendations.push('Aim for at least 150 minutes of moderate exercise per week');
  }

  if (recommendations.length === 0) {
    recommendations.push('Maintain your current healthy lifestyle habits');
    recommendations.push('Continue regular health check-ups with your doctor');
  }

  recommendations.push('Schedule regular health screenings appropriate for your age');

  return recommendations;
}

// ========================================
// Form Handling
// ========================================
function updateBMI() {
  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);
  
  if (height && weight) {
    const bmi = calculateBMI(height, weight);
    const bmiInfo = getBMICategory(bmi);
    
    document.getElementById('bmi-value').textContent = bmi.toFixed(1);
    const categoryEl = document.getElementById('bmi-category');
    categoryEl.textContent = bmiInfo.category;
    categoryEl.className = 'bmi-category ' + bmiInfo.class;
  }
}

healthForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = {
    age: parseInt(document.getElementById('age').value),
    gender: document.getElementById('gender').value,
    systolic: parseInt(document.getElementById('systolic').value),
    diastolic: parseInt(document.getElementById('diastolic').value),
    cholesterol: parseInt(document.getElementById('cholesterol').value),
    glucose: parseInt(document.getElementById('glucose').value),
    height: parseFloat(document.getElementById('height').value),
    weight: parseFloat(document.getElementById('weight').value),
    smoking: document.getElementById('smoking').checked,
    alcohol: document.getElementById('alcohol').checked,
    active: document.getElementById('active').checked,
    familyHistory: document.getElementById('family_history').checked
  };

  currentResults = calculateHealthRisk(formData);
  displayResults(currentResults);
});

document.getElementById('height').addEventListener('input', updateBMI);
document.getElementById('weight').addEventListener('input', updateBMI);

function displayResults(results) {
  resultsCard.classList.remove('hidden');
  
  // Scroll to results
  resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Update score with animation
  const scoreEl = document.getElementById('risk-score');
  const ringProgress = document.getElementById('ring-progress');
  
  // Animate score
  let currentScore = 0;
  const targetScore = results.score;
  const duration = 1000;
  const startTime = performance.now();
  
  function animateScore(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    currentScore = Math.round(progress * targetScore);
    scoreEl.textContent = currentScore;
    
    // Update ring progress
    const circumference = 339.292;
    const offset = circumference - (progress * targetScore / 100) * circumference;
    ringProgress.style.strokeDashoffset = offset;
    
    // Set ring color based on risk level
    if (results.riskClass === 'risk-low') {
      ringProgress.style.stroke = '#10b981';
    } else if (results.riskClass === 'risk-moderate') {
      ringProgress.style.stroke = '#f59e0b';
    } else {
      ringProgress.style.stroke = '#ef4444';
    }
    
    if (progress < 1) {
      requestAnimationFrame(animateScore);
    }
  }
  
  requestAnimationFrame(animateScore);

  // Update risk level
  const badge = document.getElementById('risk-badge');
  badge.textContent = results.riskLevel;
  badge.className = 'risk-level-badge ' + results.riskClass;
  
  document.getElementById('risk-description').textContent = results.riskDescription;

  // Update risk factors
  const factorsList = document.getElementById('risk-factors-list');
  factorsList.innerHTML = results.factors.map(factor => {
    const percentage = (factor.value / factor.maxValue) * 100;
    let fillClass = 'fill-low';
    if (percentage > 66) fillClass = 'fill-high';
    else if (percentage > 33) fillClass = 'fill-moderate';
    
    return `
      <div class="risk-factor-item">
        <span class="risk-factor-label">${factor.name}</span>
        <div class="risk-factor-bar">
          <div class="risk-factor-fill ${fillClass}" style="width: ${percentage}%"></div>
        </div>
        <span class="risk-factor-value">${factor.value}/${factor.maxValue}</span>
      </div>
    `;
  }).join('');

  // Update recommendations
  const recommendationsList = document.getElementById('recommendations-list');
  recommendationsList.innerHTML = results.recommendations.map(rec => `<li>${rec}</li>`).join('');

  // Update save button state
  const saveBtn = document.getElementById('save-btn');
  if (!currentUser) {
    saveBtn.textContent = 'Sign in to Save';
    saveBtn.onclick = () => showAuthModal('login');
  } else {
    saveBtn.innerHTML = `
      <svg class="btn-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
      </svg>
      Save Results
    `;
    saveBtn.onclick = saveResults;
  }
}

function resetForm() {
  healthForm.reset();
  resultsCard.classList.add('hidden');
  document.getElementById('bmi-value').textContent = '--';
  document.getElementById('bmi-category').textContent = '';
  document.getElementById('bmi-category').className = 'bmi-category';
  currentResults = null;
  
  // Scroll to form
  document.getElementById('assessment').scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// Authentication
// ========================================
function showAuthModal(type) {
  authModal.classList.remove('hidden');
  
  if (type === 'login') {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  } else {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
  }
  
  // Clear any previous errors
  document.getElementById('login-error').classList.add('hidden');
  document.getElementById('signup-error').classList.add('hidden');
  document.getElementById('signup-success').classList.add('hidden');
}

function closeAuthModal() {
  authModal.classList.add('hidden');
}

function switchAuthForm(type) {
  if (type === 'login') {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  } else {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
  }
  
  // Clear errors
  document.getElementById('login-error').classList.add('hidden');
  document.getElementById('signup-error').classList.add('hidden');
  document.getElementById('signup-success').classList.add('hidden');
}

async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');
  
  btn.disabled = true;
  btn.textContent = 'Signing in...';
  errorEl.classList.add('hidden');
  
  try {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      currentUser = data.user;
      updateAuthUI();
      closeAuthModal();
      showToast('Welcome back!', 'success');
    } else {
      // Demo mode
      currentUser = { email };
      updateAuthUI();
      closeAuthModal();
      showToast('Demo mode: Signed in as ' + email, 'success');
    }
  } catch (error) {
    errorEl.textContent = error.message || 'Invalid login credentials. Please check your email and password.';
    errorEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
}

async function handleSignup(e) {
  e.preventDefault();
  
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  const errorEl = document.getElementById('signup-error');
  const successEl = document.getElementById('signup-success');
  const btn = document.getElementById('signup-btn');
  
  errorEl.classList.add('hidden');
  successEl.classList.add('hidden');
  
  if (password !== confirm) {
    errorEl.textContent = 'Passwords do not match';
    errorEl.classList.remove('hidden');
    return;
  }
  
  if (password.length < 6) {
    errorEl.textContent = 'Password must be at least 6 characters';
    errorEl.classList.remove('hidden');
    return;
  }
  
  btn.disabled = true;
  btn.textContent = 'Creating account...';
  
  try {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
      successEl.textContent = 'Account created! Please check your email to verify your account.';
      successEl.classList.remove('hidden');
      
      // Clear form
      document.getElementById('signup-email').value = '';
      document.getElementById('signup-password').value = '';
      document.getElementById('signup-confirm').value = '';
    } else {
      // Demo mode
      currentUser = { email };
      updateAuthUI();
      closeAuthModal();
      showToast('Demo mode: Account created for ' + email, 'success');
    }
  } catch (error) {
    let message = error.message;
    if (message.toLowerCase().includes('rate limit')) {
      message = 'Too many attempts. Please wait about an hour before trying again.';
    }
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
}

async function signOut() {
  try {
    if (supabase) {
      await supabase.auth.signOut();
    }
    currentUser = null;
    updateAuthUI();
    showToast('Signed out successfully', 'success');
  } catch (error) {
    showToast('Error signing out', 'error');
  }
}

function updateAuthUI() {
  if (currentUser) {
    authButtons.classList.add('hidden');
    userMenu.classList.remove('hidden');
    userEmailSpan.textContent = currentUser.email;
  } else {
    authButtons.classList.remove('hidden');
    userMenu.classList.add('hidden');
    userEmailSpan.textContent = '';
  }
}

// ========================================
// Save & Print Results
// ========================================
async function saveResults() {
  if (!currentUser) {
    showAuthModal('login');
    return;
  }
  
  if (!currentResults) {
    showToast('No results to save', 'error');
    return;
  }
  
  try {
    if (supabase) {
      const { error } = await supabase.from('predictions').insert({
        user_id: currentUser.id,
        age: currentResults.data.age,
        gender: currentResults.data.gender,
        systolic_bp: currentResults.data.systolic,
        diastolic_bp: currentResults.data.diastolic,
        cholesterol: currentResults.data.cholesterol,
        glucose: currentResults.data.glucose,
        bmi: parseFloat(currentResults.bmi),
        smoking: currentResults.data.smoking,
        alcohol: currentResults.data.alcohol,
        physical_activity: currentResults.data.active,
        family_history: currentResults.data.familyHistory,
        risk_score: currentResults.score,
        risk_level: currentResults.riskLevel.toLowerCase().replace(' ', '_')
      });
      
      if (error) throw error;
    }
    
    showToast('Results saved successfully!', 'success');
  } catch (error) {
    showToast('Error saving results: ' + error.message, 'error');
  }
}

function printResults() {
  window.print();
}

// ========================================
// Toast Notifications
// ========================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' 
        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
        : '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
      }
    </svg>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ========================================
// Initialize
// ========================================
async function init() {
  // Check for existing session
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      currentUser = session.user;
      updateAuthUI();
    }
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      currentUser = session?.user || null;
      updateAuthUI();
    });
  }
  
  // Close modal on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAuthModal();
    }
  });
}

// Run initialization
init();
