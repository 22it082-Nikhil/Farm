// Import required libraries and components
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion' // For smooth animations and transitions
import {
  // Navigation and UI icons for homepage
  Leaf,
  Truck,
  Users,
  ShoppingCart,
  ArrowRight,
  CheckCircle
} from 'lucide-react' // Icon library for consistent UI elements

// Main HomePage Component - Landing page for the agricultural marketplace platform
const HomePage = () => {
  // ===== Scroll-based hero animation setup =====
  const TOTAL_FRAMES = 240
  const FRAME_PATH = '/frames'

  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  // Scroll progress tracking for hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  // Smooth spring animation for buttery scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Anti-gravity effect based on scroll velocity
  const scrollVelocity = useVelocity(scrollYProgress)
  const yOffset = useTransform(scrollVelocity, [-1, 0, 1], [15, 0, -15])

  // Map scroll to frame index (bi-directional)
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, TOTAL_FRAMES - 1])

  // Preload all frames (using existing JPG sequence)
  useEffect(() => {
    let isCancelled = false

    const loadImages = async () => {
      const imagePromises = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image()
          const index = i + 1 // files start at 001
          const fileNumber = String(index).padStart(3, '0')
          img.src = `${FRAME_PATH}/ezgif-frame-${fileNumber}.jpg`

          img.onload = () => {
            if (!isCancelled) {
              setLoadProgress(prev => Math.min(100, prev + 100 / TOTAL_FRAMES))
            }
            resolve(img)
          }

          img.onerror = (err) => {
            console.error('Error loading frame', img.src, err)
            reject(err)
          }
        })
      })

      try {
        const loadedImages = await Promise.all(imagePromises)
        if (!isCancelled) {
          setImages(loadedImages)
          setImagesLoaded(true)
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error loading hero animation frames', error)
        }
      }
    }

    loadImages()

    return () => {
      isCancelled = true
    }
  }, [])

  // Canvas rendering
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const renderFrame = () => {
      const currentFrame = Math.round(frameIndex.get())
      const img = images[Math.max(0, Math.min(currentFrame, TOTAL_FRAMES - 1))]

      if (!img) return

      // Responsive canvas sizing
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Contain fit
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
      const drawWidth = img.width * scale
      const drawHeight = img.height * scale
      const x = (canvas.width - drawWidth) / 2
      const y = (canvas.height - drawHeight) / 2

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, x, y, drawWidth, drawHeight)
    }

    const unsubscribe = frameIndex.on('change', renderFrame)
    renderFrame() // initial render

    const handleResize = () => {
      renderFrame()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      unsubscribe()
      window.removeEventListener('resize', handleResize)
    }
  }, [imagesLoaded, images, frameIndex])

  // Text overlay animations
  const section1Opacity = useTransform(smoothProgress, [0, 0.1, 0.2, 0.3], [0, 1, 1, 0])
  const section2Opacity = useTransform(smoothProgress, [0.3, 0.4, 0.55, 0.65], [0, 1, 1, 0])
  const section3Opacity = useTransform(smoothProgress, [0.65, 0.75, 0.9, 1], [0, 1, 1, 0])
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0])

  // Platform features data - Key benefits and capabilities
  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-primary-600" />,
      title: "Smart Farming",
      description: "Connect with service providers and buyers seamlessly"
    },
    {
      icon: <Truck className="w-8 h-8 text-primary-600" />,
      title: "Logistics Solutions",
      description: "Find vehicles and manpower for harvest operations"
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: "Community Driven",
      description: "Build relationships with fellow farmers and buyers"
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-primary-600" />,
      title: "Direct Sales",
      description: "Sell your harvest directly to buyers at fair prices"
    }
  ]

  // Platform modules data - Three main user portals with descriptions and features
  const modules = [
    {
      title: "Farmer Portal", // Portal for crop farmers
      description: "Manage harvest requirements, post crops for sale, and connect with service providers", // Portal description
      icon: <Leaf className="w-12 h-12 text-primary-600" />, // Leaf icon representing farming
      color: "from-green-500 to-emerald-600", // Green gradient for farmer theme
      features: ["Post harvest requirements", "Manage crop listings", "View service offers", "Connect with buyers"] // Key features
    },
    {
      title: "Service Provider", // Portal for service providers
      description: "Offer vehicles, manpower, and other agricultural services to farmers", // Portal description
      icon: <Truck className="w-12 h-12 text-primary-600" />, // Truck icon representing services
      color: "from-blue-500 to-cyan-600", // Blue gradient for service provider theme
      features: ["Post service details", "Bid on requirements", "Manage bookings", "Track earnings"] // Key features
    },
    {
      title: "Buyer Portal", // Portal for crop buyers
      description: "Browse fresh harvest, negotiate prices, and secure quality produce", // Portal description
      icon: <ShoppingCart className="w-12 h-12 text-primary-600" />, // Shopping cart icon representing buying
      color: "from-orange-500 to-red-600", // Orange gradient for buyer theme
      features: ["Browse crop listings", "Make offers", "Negotiate deals", "Track purchases"] // Key features
    }
  ]

  // Platform statistics data - Key metrics to showcase platform success
  const stats = [
    { number: "10K+", label: "Active Farmers" }, // Number of registered farmers
    { number: "5K+", label: "Service Providers" }, // Number of service providers
    { number: "15K+", label: "Successful Transactions" }, // Total successful deals
    { number: "98%", label: "Satisfaction Rate" } // User satisfaction percentage
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <img src="/logo.png" alt="FarmConnect Logo" className="w-12 h-12 -mr-1 md:w-14 md:h-14 md:-mr-2 -mt-1 md:-mt-1.5 rounded-lg object-contain" />
              <span className="text-xl md:text-2xl font-bold text-gray-900">FarmConnect</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-8"
            >
              <a href="#features" className="text-gray-700 hover:text-primary-600 transition-colors">Features</a>
              <a href="#modules" className="text-gray-700 hover:text-primary-600 transition-colors">Modules</a>
              <a href="#about" className="text-gray-700 hover:text-primary-600 transition-colors">About</a>
              <a href="/login" className="btn-primary inline-block">Get Started</a>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        {/* Mobile: original static hero */}
        <div className="px-4 sm:px-6 lg:px-8 md:hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
              >
                <span className="gradient-text bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
                  Revolutionizing
                </span>
                <br />
                <span className="text-gray-800">Agriculture</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
              >
                Connect farmers, service providers, and buyers in one seamless platform.
                Streamline your agricultural operations and maximize your profits.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <a href="/login" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                  Explore Modules
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </a>
                <button className="btn-outline text-lg px-8 py-4">
                  Watch Demo
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Desktop / larger screens: scroll-based canvas animation */}
        <div className="hidden md:block">
          {/* Loading overlay while frames are being fetched */}
          {!imagesLoaded && (
            <div className="fixed inset-0 z-40 bg-white/90 flex flex-col items-center justify-center">
              <div className="w-64 h-2 bg-emerald-100 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-emerald-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-emerald-700 text-lg font-semibold">
                Preparing your farm experience... {Math.round(loadProgress)}%
              </p>
            </div>
          )}

          <div ref={containerRef} className="relative h-[450vh] px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="sticky top-16 md:top-20 h-[calc(100vh-4rem)]">
                <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-3xl shadow-lg">
                  {/* Canvas */}
                  <motion.div style={{ y: yOffset }} className="w-full h-full">
                    <canvas ref={canvasRef} className="w-full h-full" />
                  </motion.div>

                  {/* Text overlays */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {/* Section 1: Main headline */}
                    <motion.div
                      style={{ opacity: section1Opacity }}
                      className="text-center px-8"
                    >
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                        <span className="gradient-text bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
                          Revolutionizing
                        </span>
                        <br />
                        <span className="text-gray-800">Agriculture</span>
                      </h1>
                      <p className="text-lg md:text-2xl text-gray-700 max-w-3xl mx-auto">
                        Connect farmers, service providers, and buyers in one seamless platform.
                      </p>
                    </motion.div>

                    {/* Section 2: Platform value */}
                    <motion.div
                      style={{ opacity: section2Opacity }}
                      className="text-left px-16 max-w-2xl"
                    >
                      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        End-to-End Farm Management
                      </h2>
                      <p className="text-base md:text-xl text-gray-700">
                        From harvest planning to logistics and sales, FarmConnect helps you streamline operations
                        and unlock better margins on every crop.
                      </p>
                    </motion.div>

                    {/* Section 3: Call-to-action content */}
                    <motion.div
                      style={{ opacity: section3Opacity }}
                      className="text-center px-8 max-w-3xl mx-auto"
                    >
                      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        One Platform. Every Stakeholder.
                      </h2>
                      <p className="text-base md:text-xl text-gray-700 mb-8">
                        Farmers, service providers, and buyers work together in real time to move harvests faster
                        and more efficiently.
                      </p>
                      <div className="pointer-events-auto flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href="/login" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                          Explore Modules
                          <ArrowRight className="w-5 h-5 ml-2 inline" />
                        </a>
                        <button className="btn-outline text-lg px-8 py-4">
                          Watch Demo
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Scroll indicator */}
                  <motion.div
                    style={{ opacity: scrollIndicatorOpacity }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
                  >
                    <p className="text-sm text-gray-600 tracking-wider uppercase">
                      Scroll to explore
                    </p>
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-6 h-10 border-2 border-emerald-400/70 rounded-full flex items-start justify-center p-1"
                    >
                      <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-primary-600">FarmConnect</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform brings together all stakeholders in the agricultural ecosystem
              to create a more efficient and profitable farming industry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8 text-center group"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your <span className="text-primary-600">Portal</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access the platform through your dedicated portal designed specifically
              for your role in the agricultural ecosystem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card p-8 hover:shadow-2xl transition-all duration-500"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${module.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  {module.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{module.title}</h3>
                <p className="text-gray-600 mb-6 text-center">{module.description}</p>

                <ul className="space-y-3 mb-8">
                  {module.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a href="/login" className="w-full btn-primary inline-flex items-center justify-center">
                  Access Portal
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Farming Business?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Join thousands of farmers, service providers, and buyers who are already
              benefiting from our platform. Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/login" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg inline-block">
                Get Started Now
              </a>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/logo.png" alt="FarmConnect Logo" className="w-12 h-12 -mr-1 -mt-1 rounded-lg object-contain" />
                <span className="text-xl font-bold text-white">FarmConnect</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing agriculture through technology and community.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Modules</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 FarmConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
