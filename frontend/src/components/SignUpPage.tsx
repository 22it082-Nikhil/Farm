// Import required libraries and components
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
    Leaf,
    Truck,
    ShoppingCart,
    ArrowLeft,
    Check
} from 'lucide-react'
import { SignUp } from '@clerk/clerk-react'

// Main SignUpPage Component - Handles registration for all three user portals
const SignUpPage = () => {
    // State management for portal selection (default to farmer, but user can switch)
    const [activeTab, setActiveTab] = useState<'farmer' | 'service' | 'buyer'>('farmer')

    const portalConfig = {
        farmer: {
            title: "Join as a Farmer",
            subtitle: "Start managing your harvest, connecting with local service providers, and selling effectively.",
            icon: <Leaf className="w-10 h-10 text-white" />,
            color: "from-green-600 to-emerald-700",
            accent: "bg-green-600",
            lightAccent: "bg-green-50 text-green-700",
            features: ["Post harvest requirements", "Manage crop listings", "View service offers", "Connect with buyers"]
        },
        service: {
            title: "Join as a Service Provider",
            subtitle: "Expand your agricultural business by offering vehicles, equipment, and manpower.",
            icon: <Truck className="w-10 h-10 text-white" />,
            color: "from-blue-600 to-indigo-700",
            accent: "bg-blue-600",
            lightAccent: "bg-blue-50 text-blue-700",
            features: ["Post service details", "Bid on requirements", "Manage bookings", "Track earnings"]
        },
        buyer: {
            title: "Join as a Buyer",
            subtitle: "Source fresh local produce directly from verified farmers at transparent prices.",
            icon: <ShoppingCart className="w-10 h-10 text-white" />,
            color: "from-orange-500 to-red-600",
            accent: "bg-orange-600",
            lightAccent: "bg-orange-50 text-orange-700",
            features: ["Browse crop listings", "Make offers", "Negotiate deals", "Track purchases"]
        }
    }

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* LEFT PANEL - Visual & Context (Hidden on mobile) */}
            <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br ${portalConfig[activeTab].color} text-white transition-all duration-700`}>
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-black opacity-10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-24 w-full h-full">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-2xl border border-white/10">
                            {portalConfig[activeTab].icon}
                        </div>

                        <h1 className="text-4xl xl:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                            {portalConfig[activeTab].title}
                        </h1>

                        <p className="text-lg xl:text-xl opacity-90 mb-12 leading-relaxed max-w-lg">
                            {portalConfig[activeTab].subtitle}
                        </p>

                        <div className="space-y-5">
                            {portalConfig[activeTab].features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + (idx * 0.1) }}
                                    className="flex items-center space-x-4"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-medium text-lg text-white/90">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* RIGHT PANEL - Sign Up Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 xl:px-24 bg-gray-50 lg:bg-white relative">
                {/* Navigation - Back to Login */}
                <nav className="absolute top-8 left-6 lg:left-auto lg:right-10 flex w-full lg:w-auto justify-between lg:justify-end px-4 lg:px-0 z-20">
                    <a href="/login" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm group">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mr-2 group-hover:bg-gray-200 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to Login
                    </a>
                </nav>

                <div className="w-full max-w-sm sm:max-w-md mt-20 lg:mt-0 relative z-10">
                    <div className="mb-12 text-center lg:text-left">
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Create Account</h2>
                        <p className="text-gray-500 text-lg">Join the community today</p>
                    </div>

                    {/* Portal Selection Pills */}
                    <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100 rounded-xl mb-10">
                        {(Object.keys(portalConfig) as Array<keyof typeof portalConfig>).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center justify-center rounded-lg py-3 text-sm font-semibold transition-all duration-300 ${activeTab === tab
                                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5 scale-[1.02]'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Clerk Authentication Component - SignUp */}
                    <div className="w-full">
                        <div className="login-wrapper">
                            <SignUp
                                appearance={{
                                    elements: {
                                        rootBox: "w-full",
                                        card: "shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 w-full bg-white rounded-[2rem] border border-gray-50",
                                        headerTitle: "hidden",
                                        headerSubtitle: "hidden",
                                        formButtonPrimary: `bg-gradient-to-r ${portalConfig[activeTab].color} text-white py-4 rounded-2xl hover:opacity-90 shadow-lg transform hover:-translate-y-0.5 transition-all text-base`,
                                        formFieldInput: "rounded-2xl border-gray-100 focus:border-indigo-500 focus:ring-indigo-500 py-3.5 bg-gray-50",
                                        formFieldLabel: "ml-2 text-gray-500 font-medium",
                                        socialButtonsBlockButton: "py-3.5 rounded-2xl border-none bg-gray-50 hover:bg-gray-100 font-medium text-gray-600 transition-colors",
                                        footerActionLink: `text-${portalConfig[activeTab].accent.split('-')[1]}-600 font-bold hover:underline`,
                                    },
                                    layout: {
                                        socialButtonsPlacement: 'top',
                                        showOptionalFields: false
                                    }
                                }}
                                forceRedirectUrl={`/auth-callback?role=${activeTab}`}
                                signInUrl="/login"
                            />
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-xs text-gray-400 font-medium">
                            Protected by Enterprise Grade Security • Trusted by 10k+ Farmers
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage
