'use client'

import React from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Activity, Loader2, Heart, BarChart3, Lock, AlertCircle, Clock, CheckCircle2 } from 'lucide-react'

function getErrorMessage(error: string): { message: string; hint: string } {
  if (error.toLowerCase().includes('rate limit')) {
    return {
      message: 'Too many attempts',
      hint: 'Please wait about an hour before trying again, or use a different email address.'
    }
  }
  if (error.toLowerCase().includes('already registered')) {
    return {
      message: 'Email already registered',
      hint: 'This email is already in use. Try signing in instead.'
    }
  }
  return { message: error, hint: '' }
}

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/`,
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      router.push('/auth/sign-up-success')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const errorInfo = error ? getErrorMessage(error) : null
  const passwordsMatch = password && confirmPassword && password === confirmPassword
  const passwordLongEnough = password.length >= 6

  return (
    <div className="flex min-h-screen">
      {/* Left side - Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-32 right-20 w-80 h-80 rounded-full" style={{ background: 'white' }} />
          <div className="absolute bottom-20 left-16 w-64 h-64 rounded-full" style={{ background: 'white' }} />
          <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full" style={{ background: 'white' }} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold">HealthRisk AI</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Start Your Health Journey</h1>
            <p className="text-xl text-white/80">Create an account to track and improve your health metrics.</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Comprehensive Analysis</h3>
                <p className="text-sm text-white/70">Get detailed health risk assessments</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Track Progress</h3>
                <p className="text-sm text-white/70">Monitor your improvements over time</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Private & Secure</h3>
                <p className="text-sm text-white/70">Your data stays protected always</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8" style={{ background: 'linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%)' }}>
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: '#059669' }}>
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-semibold" style={{ color: '#059669' }}>HealthRisk AI</span>
        </Link>

        <Card className="w-full max-w-md border-0 shadow-xl" style={{ background: 'white' }}>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold" style={{ color: '#064e3b' }}>Create Account</CardTitle>
            <CardDescription className="text-base">Join us to track your health journey</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-4 pt-4">
              {errorInfo && (
                <div className="rounded-lg p-4" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                  <div className="flex items-start gap-3">
                    {error?.toLowerCase().includes('rate limit') ? (
                      <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: '#dc2626' }} />
                    ) : (
                      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: '#dc2626' }} />
                    )}
                    <div>
                      <p className="font-medium" style={{ color: '#dc2626' }}>{errorInfo.message}</p>
                      {errorInfo.hint && (
                        <p className="text-sm mt-1" style={{ color: '#7f1d1d' }}>{errorInfo.hint}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#064e3b' }}>Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 text-base border-2"
                  style={{ borderColor: '#d1d5db', background: '#f9fafb' }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#064e3b' }}>Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 text-base border-2"
                  style={{ borderColor: '#d1d5db', background: '#f9fafb' }}
                />
                {password && (
                  <div className="flex items-center gap-2 text-xs">
                    {passwordLongEnough ? (
                      <CheckCircle2 className="h-3.5 w-3.5" style={{ color: '#059669' }} />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border-2" style={{ borderColor: '#d1d5db' }} />
                    )}
                    <span style={{ color: passwordLongEnough ? '#059669' : '#6b7280' }}>At least 6 characters</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium" style={{ color: '#064e3b' }}>Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 text-base border-2"
                  style={{ 
                    borderColor: confirmPassword ? (passwordsMatch ? '#059669' : '#dc2626') : '#d1d5db', 
                    background: '#f9fafb' 
                  }}
                />
                {confirmPassword && (
                  <div className="flex items-center gap-2 text-xs">
                    {passwordsMatch ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" style={{ color: '#059669' }} />
                        <span style={{ color: '#059669' }}>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3.5 w-3.5" style={{ color: '#dc2626' }} />
                        <span style={{ color: '#dc2626' }}>Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
                disabled={isLoading || !passwordsMatch || !passwordLongEnough}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              <p className="text-center text-sm" style={{ color: '#64748b' }}>
                Already have an account?{' '}
                <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: '#059669' }}>
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        <p className="mt-8 text-center text-xs" style={{ color: '#94a3b8' }}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
