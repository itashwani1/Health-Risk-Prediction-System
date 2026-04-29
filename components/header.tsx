'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Activity, History, LogIn, LogOut, User, Menu, X, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

import { usePathname } from 'next/navigation'
import { ModeToggle } from '@/components/mode-toggle'

export function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = createClient()
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'FAQ', href: '#faq' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105" onClick={() => setIsMenuOpen(false)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-foreground">HealthRisk AI</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          
          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Button 
                      variant="ghost" 
                      asChild 
                      className={`relative px-4 font-bold text-muted-foreground hover:text-foreground hover:bg-accent ${isActive('/history') ? 'text-foreground' : ''}`}
                    >
                      <Link href="/history">
                        <History className="mr-2 h-4 w-4" />
                        History
                        {isActive('/history') && (
                          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500" />
                        )}
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={handleSignOut}
                      className="px-4 font-bold text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      asChild
                      className="px-6 font-bold text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                    <Button 
                      asChild
                      className="px-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xl"
                    >
                      <Link href="/auth/sign-up">Get Started</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-white hover:bg-white/5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-background border-b border-border p-6 animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-lg font-bold text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="h-px bg-border my-2" />
            {!loading && (
              <div className="flex flex-col gap-4">
                {user ? (
                  <>
                    <Link 
                      href="/history" 
                      className="flex items-center justify-between text-lg font-bold text-muted-foreground"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>History</span>
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center justify-between text-lg font-bold text-destructive"
                    >
                      <span>Sign Out</span>
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/auth/login" 
                      className="flex items-center justify-between text-lg font-bold text-muted-foreground"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Sign In</span>
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                    <Button 
                      asChild
                      className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/auth/sign-up">Get Started Free</Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
