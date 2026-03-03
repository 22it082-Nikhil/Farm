// FarmConnect HomePage - Premium redesign with scroll-triggered canvas animation
import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Leaf, Truck, ShoppingCart, ArrowRight, CheckCircle,
  Star, Shield, Zap, TrendingUp, Users, Globe, ChevronDown
} from 'lucide-react'

// ─────────────────────────────────────────────
// HERO CANVAS ANIMATION COMPONENT
// ─────────────────────────────────────────────
const TOTAL_FRAMES = 40
const FRAME_PATH = '/frames'

function HeroCanvasAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  // Tighter spring = more responsive, less lag
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.0005
  })

  const scrollVelocity = useVelocity(scrollYProgress)
  const yOffset = useTransform(scrollVelocity, [-1, 0, 1], [10, 0, -10])

  // Raw float frame index (not rounded) for interpolation
  const frameIndexFloat = useTransform(smoothProgress, [0, 1], [0, TOTAL_FRAMES - 1])

  // Preload all frames into a ref (avoids state re-renders)
  useEffect(() => {
    let loaded = 0
    const imageList: HTMLImageElement[] = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const img = new Image()
      img.src = `${FRAME_PATH}/frame_${i}.jpg`
      img.onload = () => {
        loaded++
        setLoadProgress((loaded / TOTAL_FRAMES) * 100)
        if (loaded === TOTAL_FRAMES) {
          imagesRef.current = imageList
          setImagesLoaded(true)
        }
      }
      img.onerror = () => {
        loaded++
        setLoadProgress((loaded / TOTAL_FRAMES) * 100)
        if (loaded === TOTAL_FRAMES) {
          imagesRef.current = imageList
          setImagesLoaded(true)
        }
      }
      return img
    })
  }, [])

  // Canvas rendering via requestAnimationFrame — silky smooth
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Size canvas once, then only on resize (NOT on every frame)
    const sizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    sizeCanvas()

    const drawImage = (img: HTMLImageElement, alpha: number) => {
      if (!img || !img.complete || img.naturalWidth === 0) return
      const scaleX = canvas.width / img.naturalWidth
      const scaleY = canvas.height / img.naturalHeight
      const scale = Math.max(scaleX, scaleY)
      const x = (canvas.width - img.naturalWidth * scale) / 2
      const y = (canvas.height - img.naturalHeight * scale) / 2
      ctx.globalAlpha = alpha
      ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale)
      ctx.globalAlpha = 1
    }

    // rAF render loop — runs every display frame (~60fps) for buttery smoothness
    let rafId: number
    const renderLoop = () => {
      const imgs = imagesRef.current
      if (imgs.length === 0) { rafId = requestAnimationFrame(renderLoop); return }

      // Get the exact (float) frame position — no rounding yet
      const rawIdx = Math.max(0, Math.min(frameIndexFloat.get(), TOTAL_FRAMES - 1))
      const loIdx = Math.floor(rawIdx)                          // current frame
      const hiIdx = Math.min(loIdx + 1, TOTAL_FRAMES - 1)      // next frame
      const blend = rawIdx - loIdx                              // 0.0 → 1.0 blend factor

      const imgLo = imgs[loIdx]
      const imgHi = imgs[hiIdx]
      if (!imgLo || !imgLo.complete || imgLo.naturalWidth === 0) {
        rafId = requestAnimationFrame(renderLoop); return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw current frame at full opacity
      drawImage(imgLo, 1)

      // Cross-fade next frame on top when between frames
      if (blend > 0 && imgHi && imgHi.complete && imgHi.naturalWidth > 0) {
        drawImage(imgHi, blend)
      }

      rafId = requestAnimationFrame(renderLoop)
    }
    rafId = requestAnimationFrame(renderLoop)

    const handleResize = () => sizeCanvas()
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [imagesLoaded, frameIndexFloat])

  // Text overlays keyed to scroll progress
  const s1Opacity = useTransform(smoothProgress, [0, 0.08, 0.18, 0.24], [0, 1, 1, 0])
  const s2Opacity = useTransform(smoothProgress, [0.28, 0.34, 0.5, 0.56], [0, 1, 1, 0])
  const s3Opacity = useTransform(smoothProgress, [0.6, 0.66, 0.8, 0.86], [0, 1, 1, 0])
  const s4Opacity = useTransform(smoothProgress, [0.88, 0.92, 0.98, 1], [0, 1, 1, 0])
  const scrollIndicator = useTransform(smoothProgress, [0, 0.08], [1, 0])

  const s1Y = useTransform(smoothProgress, [0, 0.08], [40, 0])
  const s2Y = useTransform(smoothProgress, [0.28, 0.34], [40, 0])
  const s3Y = useTransform(smoothProgress, [0.6, 0.66], [40, 0])
  const s4Y = useTransform(smoothProgress, [0.88, 0.92], [40, 0])

  if (!imagesLoaded) {
    return (
      <div className="fixed inset-0 bg-[#0A1A0F] flex flex-col items-center justify-center z-50">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-8"
        >
          <Leaf className="w-16 h-16 text-emerald-400" />
        </motion.div>
        <div className="w-72 h-2 bg-emerald-900/40 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
              width: `${loadProgress}%`
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-emerald-300/80 text-base font-medium tracking-wide">
          Loading FarmConnect... {Math.round(loadProgress)}%
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas */}
        <motion.div style={{ y: yOffset }} className="w-full h-full">
          <canvas ref={canvasRef} className="w-full h-full" />
        </motion.div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none" />

        {/* Text Overlays - all positioned over the canvas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

          {/* Slide 1: Main Title */}
          <motion.div
            style={{ opacity: s1Opacity, y: s1Y }}
            className="text-center px-6 absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="inline-block text-emerald-400 text-sm md:text-base font-semibold tracking-[0.3em] uppercase mb-4 bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/30">
              Agricultural Marketplace Platform
            </span>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-5 leading-tight drop-shadow-2xl"
              style={{ fontFamily: 'Poppins, sans-serif' }}>
              Revolutionizing
              <br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #4ade80, #22c55e, #86efac)' }}>
                Agriculture
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/75 max-w-2xl font-medium drop-shadow-lg">
              Connecting farmers, service providers & buyers in one seamless ecosystem
            </p>
          </motion.div>

          {/* Slide 2 */}
          <motion.div
            style={{ opacity: s2Opacity, y: s2Y }}
            className="absolute inset-0 flex flex-col items-start justify-center px-10 md:px-20"
          >
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">
                <Leaf className="w-4 h-4" /> Smart Farming
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-2xl"
                style={{ fontFamily: 'Poppins, sans-serif' }}>
                From Field<br />to Market
              </h2>
              <p className="text-base md:text-lg text-white/70 font-medium drop-shadow-lg">
                List your crops, find buyers, hire logistics — all in one place with zero friction.
              </p>
            </div>
          </motion.div>

          {/* Slide 3 */}
          <motion.div
            style={{ opacity: s3Opacity, y: s3Y }}
            className="absolute inset-0 flex flex-col items-end justify-center px-10 md:px-20"
          >
            <div className="max-w-xl text-right">
              <span className="inline-flex items-center gap-2 justify-end text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">
                <TrendingUp className="w-4 h-4" /> Maximum Profit
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-2xl"
                style={{ fontFamily: 'Poppins, sans-serif' }}>
                Fair Prices,<br />Direct Deals
              </h2>
              <p className="text-base md:text-lg text-white/70 font-medium drop-shadow-lg">
                Eliminate middlemen and negotiate directly with trusted buyers across the country.
              </p>
            </div>
          </motion.div>

          {/* Slide 4: CTA */}
          <motion.div
            style={{ opacity: s4Opacity, y: s4Y }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-2xl"
              style={{ fontFamily: 'Poppins, sans-serif' }}>
              Choose Your Portal
            </h2>
            <p className="text-base md:text-lg text-white/70 mb-8 max-w-xl font-medium drop-shadow-lg">
              Join thousands who are transforming their agricultural business
            </p>
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="pointer-events-auto"
            >
              <a
                href="#modules"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-lg shadow-2xl transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)' }}
              >
                Explore Modules <ChevronDown className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: scrollIndicator }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <p className="text-white/50 text-xs font-medium tracking-[0.2em] uppercase">Scroll to Explore</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-2.5 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// STATS BAR
// ─────────────────────────────────────────────
const stats = [
  { number: '10K+', label: 'Active Farmers', icon: <Users className="w-6 h-6" /> },
  { number: '5K+', label: 'Service Providers', icon: <Truck className="w-6 h-6" /> },
  { number: '15K+', label: 'Transactions', icon: <TrendingUp className="w-6 h-6" /> },
  { number: '98%', label: 'Satisfaction Rate', icon: <Star className="w-6 h-6" /> }
]

function StatsSection() {
  return (
    <section className="py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #061008 0%, #0d2010 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)' }}>
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-1"
                style={{ fontFamily: 'Poppins, sans-serif' }}>
                {stat.number}
              </div>
              <div className="text-emerald-300/60 text-sm font-medium tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// FEATURES SECTION
// ─────────────────────────────────────────────
const features = [
  {
    icon: <Leaf className="w-7 h-7" />,
    title: 'Smart Farming',
    description: 'Connect with service providers and buyers seamlessly through our intelligent matchmaking system.',
    color: '#22c55e'
  },
  {
    icon: <Truck className="w-7 h-7" />,
    title: 'Logistics Solutions',
    description: 'Find vehicles, manpower and storage for your harvest operations with real-time availability.',
    color: '#3b82f6'
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: 'Secure Transactions',
    description: 'Every deal is protected with verified profiles, transparent pricing, and safe payment flows.',
    color: '#f59e0b'
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: 'Real-Time Bidding',
    description: 'Post your harvest requirements and receive competitive bids from service providers instantly.',
    color: '#a855f7'
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: 'Nationwide Reach',
    description: 'Access buyers and service providers from across the country through our growing network.',
    color: '#06b6d4'
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    title: 'Market Insights',
    description: 'Get live crop prices, demand trends and analytics to make smarter business decisions.',
    color: '#ec4899'
  }
]

function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0d2010 0%, #1a5225 100%)' }}>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-emerald-300 text-sm font-semibold tracking-[0.3em] uppercase mb-4 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
            Platform Benefits
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5"
            style={{ fontFamily: 'Poppins, sans-serif' }}>
            Why Choose{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #86efac, #4ade80)' }}>
              FarmConnect
            </span>?
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium">
            Everything you need to streamline your agricultural operations in one powerful platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative p-6 rounded-2xl transition-all duration-300 cursor-default overflow-hidden border border-white/10"
              style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${f.color}22`, color: f.color, border: `1px solid ${f.color}40` }}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {f.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// PORTALS / MODULES SECTION
// ─────────────────────────────────────────────
const modules = [
  {
    title: 'Farmer Portal',
    tagline: 'Grow & Manage',
    description: 'List crops, post harvest requirements, connect with trusted service providers and buyers.',
    icon: <Leaf className="w-10 h-10" />,
    gradient: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
    glowColor: '#22c55e',
    shadowColor: 'rgba(34,197,94,0.35)',
    features: ['Post harvest requirements', 'Manage crop listings', 'View service offers', 'Connect with buyers'],
    badge: 'Most Popular'
  },
  {
    title: 'Service Provider',
    tagline: 'Offer & Earn',
    description: 'Showcase your vehicles, manpower and agricultural services. Bid and win contracts effortlessly.',
    icon: <Truck className="w-10 h-10" />,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    glowColor: '#3b82f6',
    shadowColor: 'rgba(59,130,246,0.35)',
    features: ['Post service details', 'Bid on requirements', 'Manage bookings', 'Track earnings'],
    badge: null
  },
  {
    title: 'Buyer Portal',
    tagline: 'Source & Buy',
    description: 'Browse fresh harvests, compare prices, negotiate directly and secure quality produce.',
    icon: <ShoppingCart className="w-10 h-10" />,
    gradient: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
    glowColor: '#f97316',
    shadowColor: 'rgba(249,115,22,0.35)',
    features: ['Browse crop listings', 'Make competitive offers', 'Negotiate deals', 'Track purchases'],
    badge: null
  }
]

function ModulesSection() {
  const navigate = useNavigate()

  return (
    <section id="modules" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1a5225 0%, #d4edd7 100%)' }}>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-emerald-200 text-sm font-semibold tracking-[0.3em] uppercase mb-4 bg-white/15 px-4 py-1.5 rounded-full border border-white/25">
            Your Portal
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5"
            style={{ fontFamily: 'Poppins, sans-serif' }}>
            Choose Your{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #86efac, #4ade80)' }}>
              Gateway
            </span>
          </h2>
          <p className="text-white/65 text-lg max-w-2xl mx-auto font-medium">
            Every stakeholder has a dedicated portal designed for their specific role in the agricultural ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {modules.map((mod, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="relative group flex flex-col rounded-3xl overflow-hidden bg-white border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Top gradient accent */}
              <div className="h-1 w-full" style={{ background: mod.gradient }} />

              <div className="p-8 flex flex-col flex-1">
                {/* Badge */}
                {mod.badge && (
                  <div className="absolute top-6 right-6">
                    <span className="text-xs font-bold px-3 py-1 rounded-full tracking-wide"
                      style={{ background: `${mod.glowColor}15`, color: mod.glowColor, border: `1px solid ${mod.glowColor}30` }}>
                      ★ {mod.badge}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div
                  className="inline-flex w-16 h-16 items-center justify-center rounded-2xl mb-6 text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ background: mod.gradient, boxShadow: `0 8px 32px ${mod.shadowColor}` }}
                >
                  {mod.icon}
                </div>

                <span className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: mod.glowColor }}>
                  {mod.tagline}
                </span>

                <h3 className="text-2xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {mod.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed mb-6">{mod.description}</p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {mod.features.map((feat, fi) => (
                    <li key={fi} className="flex items-center gap-3 text-gray-600 text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: mod.glowColor }} />
                      {feat}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/login')}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
                  style={{ background: mod.gradient, boxShadow: `0 4px 24px ${mod.shadowColor}` }}
                >
                  Access {mod.title.split(' ')[0]} Portal
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// FINAL CTA SECTION
// ─────────────────────────────────────────────
function FinalCTA() {
  const navigate = useNavigate()

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #d4edd7 0%, #f4fbf5 100%)' }}>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="text-emerald-500 text-3xl mb-6 inline-block"
          >
            ✦
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight"
            style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ready to Transform<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #16a34a, #22c55e)' }}>
              Your Farm Business?
            </span>
          </h2>

          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto font-medium">
            Join thousands of farmers, service providers, and buyers who are already maximizing
            their profits through FarmConnect.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 20px 60px rgba(34,197,94,0.3)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/login')}
              className="px-10 py-4 rounded-full font-bold text-white text-lg inline-flex items-center gap-2 shadow-lg transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)' }}
            >
              Get Started Now <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.a
              href="#modules"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-10 py-4 rounded-full font-bold text-emerald-700 text-lg border-2 border-emerald-400 hover:border-emerald-600 transition-all duration-300 bg-white/60 hover:bg-white"
            >
              Explore Portals
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="text-white py-16"
      style={{
        background: 'linear-gradient(180deg, #f4fbf5 0%, #c8e8cc 15%, #4a9e56 35%, #1a5225 60%, #0d2010 80%, #061008 100%)',
        borderTop: 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img src="/logo-white.png" alt="FarmConnect Logo" className="w-12 h-12 object-contain -mr-1" />
              <span className="text-xl font-black text-white drop-shadow-md" style={{ fontFamily: 'Poppins, sans-serif' }}>FarmConnect</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed drop-shadow-sm">
              Revolutionizing agriculture through technology, transparency and community.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wide uppercase drop-shadow-sm">Platform</h4>
            <ul className="space-y-2.5 text-white/60 text-sm">
              <li><a href="#features" className="hover:text-emerald-200 transition-colors">Features</a></li>
              <li><a href="#modules" className="hover:text-emerald-200 transition-colors">Modules</a></li>
              <li><a href="/login" className="hover:text-emerald-200 transition-colors">Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wide uppercase drop-shadow-sm">Support</h4>
            <ul className="space-y-2.5 text-white/60 text-sm">
              <li><a href="#" className="hover:text-emerald-200 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-200 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-emerald-200 transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wide uppercase drop-shadow-sm">Connect</h4>
            <ul className="space-y-2.5 text-white/60 text-sm">
              <li><a href="#" className="hover:text-emerald-200 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-emerald-200 transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-emerald-200 transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/50 text-sm">
          © 2026 FarmConnect. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(4,10,3,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src="/logo-white.png" alt="FarmConnect Logo" className="w-12 h-12 object-contain" />
            <span className="text-xl font-black text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>FarmConnect</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#features" className="text-white/60 hover:text-emerald-400 transition-colors text-sm font-medium">Features</a>
            <a href="#modules" className="text-white/60 hover:text-emerald-400 transition-colors text-sm font-medium">Modules</a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-5 py-2 rounded-full text-white font-bold text-sm transition-all duration-300 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)' }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </div>
    </nav>
  )
}

// ─────────────────────────────────────────────
// MAIN HOMEPAGE
// ─────────────────────────────────────────────
const HomePage = () => {
  return (
    <div className="min-h-screen" style={{ background: '#060f04' }}>
      {/* Fixed Navigation */}
      <Navbar />

      {/* Hero: Scroll-triggered canvas animation (500vh tall) */}
      <HeroCanvasAnimation />

      {/* Platform Stats */}
      <StatsSection />

      {/* Features */}
      <FeaturesSection />

      {/* 3 Portal Cards - all redirect to /login */}
      <ModulesSection />

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default HomePage
