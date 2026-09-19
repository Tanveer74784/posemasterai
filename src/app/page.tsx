'use client'

import Link from 'next/link'
import { Camera, Sparkles, Users, Zap, Star, ChevronRight, Heart, Trophy } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Poses',
    description: 'Gemini AI se 9 unique poses milenge har baar — occasion aur group size ke hisaab se perfectly tailored.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Any Group Size',
    description: 'Solo selfie ho ya 50 log ka group photo — har size ke liye perfect poses available hain.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Camera,
    title: '10+ Occasions',
    description: 'Wedding, Casual, Party, Travel, Professional — har occasion ke liye customized poses.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Seconds mein 9 poses generate hote hain step-by-step instructions aur pro tips ke saath.',
    color: 'from-emerald-500 to-teal-500',
  },
]

const stats = [
  { value: '500+', label: 'Unique Poses', icon: '🎭' },
  { value: '10+', label: 'Occasions', icon: '🎉' },
  { value: '50+', label: 'Group Sizes', icon: '👥' },
  { value: '100%', label: 'AI Powered', icon: '🤖' },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Wedding Photographer',
    text: 'Iss app ne meri life badal di! Ab couples ko direct poses suggest kar sakti hoon. Clients bilkul khush rehte hain.',
    rating: 5,
    avatar: '👩‍🦱',
  },
  {
    name: 'Rahul Mehta',
    role: 'Content Creator',
    text: 'Solo poses ke liye best app! Har baar naya aur creative pose milta hai. Instagram reels ke liye kamaal hai.',
    rating: 5,
    avatar: '👨‍🦲',
  },
  {
    name: 'Anjali & Vikram',
    role: 'Newlyweds',
    text: 'Humari engagement shoot ke liye use kiya — photographer bhi impress hua! Romantic poses bilkul perfect the.',
    rating: 5,
    avatar: '👫',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Pose<span className="text-gradient">Master</span> AI
              </span>
            </div>
            <Link
              href="/poses"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              Try Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm text-purple-300 mb-8 border border-purple-500/20">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Google Gemini AI</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
            <span className="block text-white">Perfect Pose,</span>
            <span className="block text-gradient">Every Time.</span>
          </h1>

          <p className="text-xl sm:text-2xl text-zinc-400 mb-4 max-w-3xl mx-auto leading-relaxed">
            Aaj ke wahiyat pose apps ka khatma — <span className="text-white font-medium">PoseMaster AI</span> aapko
            <span className="text-purple-400"> 1 se lekar 50+ log</span> tak ke liye AI-generated perfect poses deta hai.
          </p>
          <p className="text-lg text-zinc-500 mb-10 max-w-2xl mx-auto">
            Wedding 💍 • Casual 😎 • Party 🎉 • Travel ✈️ • Family 👨‍👩‍👧‍👦 • Professional 💼 — Har occasion covered!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/poses"
              className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-200 hover:scale-105 glow-purple"
            >
              <Sparkles className="w-5 h-5" />
              Pose Generate Karo — Free!
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 glass-card text-zinc-300 hover:text-white px-8 py-4 rounded-2xl text-lg font-medium transition-all duration-200 hover:border-purple-500/50"
            >
              Features Dekho
            </a>
          </div>

          {/* Hero Illustration */}
          <div className="mt-16 relative">
            <div className="glass-card rounded-3xl p-8 max-w-4xl mx-auto glow-purple">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { emoji: '🧍', label: 'Solo', pose: 'Power Stance', difficulty: 'Easy', color: 'from-purple-500/20 to-pink-500/20' },
                  { emoji: '👫', label: 'Couple', pose: 'The Forehead Touch', difficulty: 'Easy', color: 'from-pink-500/20 to-red-500/20' },
                  { emoji: '👨‍👩‍👧‍👦', label: 'Family', pose: 'Circle of Love', difficulty: 'Medium', color: 'from-blue-500/20 to-cyan-500/20' },
                ].map((item) => (
                  <div key={item.label} className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 text-center border border-white/5`}>
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <div className="text-sm text-zinc-400">{item.label}</div>
                    <div className="text-base font-bold text-white mt-1">{item.pose}</div>
                    <div className="mt-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full inline-block">
                      {item.difficulty}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-sm text-zinc-500">
                ⬆️ Sample AI-generated poses — actual results are much more detailed!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="text-3xl font-black text-gradient">{stat.value}</div>
                <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Kyun hai <span className="text-gradient">PoseMaster AI</span> best?
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Doosre apps sirf static images dikhate hain. Hum AI se personalized, actionable poses generate karte hain.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="glass-card rounded-2xl p-6 card-hover">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white/2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Kaise kaam karta hai?</h2>
            <p className="text-zinc-400 text-lg">3 simple steps mein perfect poses!</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Group Size Choose Karo',
                description: 'Akele ho ya 50 logon ka group — sabke liye ready hai.',
                emoji: '👥',
                color: 'from-purple-500 to-violet-500',
              },
              {
                step: '02',
                title: 'Occasion Select Karo',
                description: 'Wedding se leke casual hangout tak — sab covered.',
                emoji: '🎭',
                color: 'from-pink-500 to-rose-500',
              },
              {
                step: '03',
                title: 'AI Poses Pao!',
                description: '9 unique poses milenge, step-by-step instructions aur pro tips ke saath.',
                emoji: '✨',
                color: 'from-orange-500 to-amber-500',
              },
            ].map((step, index) => (
              <div key={step.step} className="relative text-center">
                {index < 2 && (
                  <div className="hidden sm:block absolute top-8 left-3/4 w-1/2 h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 text-2xl`}>
                  {step.emoji}
                </div>
                <div className="text-xs font-bold text-zinc-600 mb-2 tracking-widest">STEP {step.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Log kya kehte hain? 💬</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-6 card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{t.avatar}</div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-zinc-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 glow-purple border border-purple-500/20">
            <div className="text-5xl mb-4">📸</div>
            <h2 className="text-4xl font-black text-white mb-4">
              Ready for your <span className="text-gradient">perfect shot?</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-8">
              Ab boring poses ka zamana gaya! AI se generate karo unique, trendy poses — ekdum free mein.
            </p>
            <Link
              href="/poses"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-200 hover:scale-105"
            >
              <Sparkles className="w-6 h-6" />
              Abhi Try Karo — Free!
              <ChevronRight className="w-6 h-6" />
            </Link>
            <p className="text-zinc-600 text-sm mt-4">No signup required • Instant results • 100% Free</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Camera className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm">PoseMaster AI</span>
          </div>
          <p className="text-zinc-600 text-sm flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> using Google Gemini AI
          </p>
          <p className="text-zinc-700 text-xs">© 2024 PoseMaster AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
