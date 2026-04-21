import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)' }}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-30" style={{ background: '#10b981' }} />
        <div className="absolute bottom-32 right-20 w-80 h-80 rounded-full opacity-20" style={{ background: '#059669' }} />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full opacity-25" style={{ background: '#34d399' }} />
      </div>
      
      <Link href="/" className="mb-8 flex items-center gap-2 relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
          <Activity className="h-7 w-7 text-white" />
        </div>
        <span className="text-2xl font-bold" style={{ color: '#064e3b' }}>HealthRisk AI</span>
      </Link>

      <Card className="w-full max-w-md text-center border-0 shadow-2xl relative z-10" style={{ background: 'white' }}>
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>
              <Mail className="h-10 w-10" style={{ color: '#059669' }} />
            </div>
            <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full shadow-md" style={{ background: '#059669' }}>
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-5 w-5" style={{ color: '#f59e0b' }} />
            <CardTitle className="text-2xl font-bold" style={{ color: '#064e3b' }}>You're Almost There!</CardTitle>
            <Sparkles className="h-5 w-5" style={{ color: '#f59e0b' }} />
          </div>
          <CardDescription className="text-base" style={{ color: '#374151' }}>
            We've sent a confirmation email to your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-xl p-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-sm" style={{ color: '#166534' }}>
              Click the link in your email to verify your account and unlock all features of HealthRisk AI.
            </p>
          </div>
          
          <div className="space-y-3 pt-2">
            <p className="text-xs" style={{ color: '#6b7280' }}>
              Didn't receive the email? Check your spam folder or wait a few minutes.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                asChild
                className="h-12 text-base font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
              >
                <Link href="/auth/login">
                  Continue to Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" asChild className="h-10" style={{ color: '#059669' }}>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
