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
import { Activity, Loader2, Heart, Shield, TrendingUp, AlertCircle, Info } from 'lucide-react'

function getErrorMessage(error: string): { message: string; hint: string } {
  if (error.toLowerCase().includes('invalid login credentials')) {
    return {
      message: 'Invalid email or password',
      hint: 'Please check your credentials or sign up if you don\'t have an account yet.'
    }
  }
  if (error.toLowerCase().includes('email not confirmed')) {
    return {
      message: 'Email not confirmed',
      hint: 'Please check your inbox and click the confirmation link we sent you.'
    }
  }
  return { message: error, hint: '' }
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const errorInfo = error ? getErrorMessage(error) : null

  return (
    <div className="flex min-h-screen">
      {/* Left side - Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #059669 50%, #10b981 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full" style={{ background: 'white' }} />
          <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full" style={{ background: 'white' }} />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full" style={{ background: 'white' }} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold">HealthRisk AI</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-xl text-white/80">Sign in to continue monitoring your health journey.</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Heart Health Monitoring</h3>
                <p className="text-sm text-white/70">Track your cardiovascular risk factors</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Progress Tracking</h3>
                <p className="text-sm text-white/70">View your health trends over time</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Secure & Private</h3>
                <p className="text-sm text-white/70">Your health data is always protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8" style={{ background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)' }}>
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: '#0d9488' }}>
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-semibold" style={{ color: '#0d9488' }}>HealthRisk AI</span>
        </Link>

        <Card className="w-full max-w-md border-0 shadow-xl" style={{ background: 'white' }}>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold" style={{ color: '#134e4a' }}>Sign In</CardTitle>
            <CardDescription className="text-base">Access your health assessments and history</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5 pt-4">
              {errorInfo && (
                <div className="rounded-lg p-4" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: '#dc2626' }} />
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
                <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#134e4a' }}>Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 text-base border-2 focus:ring-2"
                  style={{ borderColor: '#d1d5db', background: '#f9fafb' }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#134e4a' }}>Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 text-base border-2 focus:ring-2"
                  style={{ borderColor: '#d1d5db', background: '#f9fafb' }}
                />
              </div>
              
              <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: '#f0fdfa' }}>
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#0d9488' }} />
                <p className="text-xs" style={{ color: '#115e59' }}>
                  New here? You need to <Link href="/auth/sign-up" className="font-semibold underline" style={{ color: '#0d9488' }}>create an account</Link> first before signing in.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              <p className="text-center text-sm" style={{ color: '#64748b' }}>
                {"Don't have an account? "}
                <Link href="/auth/sign-up" className="font-semibold hover:underline" style={{ color: '#0d9488' }}>
                  Create one now
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        <p className="mt-8 text-center text-xs" style={{ color: '#94a3b8' }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
