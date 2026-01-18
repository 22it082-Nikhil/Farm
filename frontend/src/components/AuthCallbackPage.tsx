import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const AuthCallbackPage = () => {
    const { user, isLoaded } = useUser()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const role = searchParams.get('role')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const syncUser = async () => {
            if (isLoaded && user) {
                try {
                    // Prepare data for backend sync
                    const userData = {
                        clerkId: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName || user.primaryEmailAddress?.emailAddress?.split('@')[0],
                        role: role || 'farmer', // Default to farmer if lost
                        // We can add other fields if they exist in user.unsafeMetadata
                    }

                    console.log("Syncing user to backend...", userData)

                    // Call your backend to sync/create user
                    const res = await fetch('http://127.0.0.1:5001/api/auth/sync', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    })

                    const data = await res.json()

                    if (res.ok) {
                        // Save MongoDB user data to local storage for legacy dashboards
                        localStorage.setItem('user', JSON.stringify(data.user))

                        // Redirect to dashboard
                        const target = `/${data.user.role === 'service' ? 'service-provider' : data.user.role}-dashboard`
                        navigate(target)
                    } else {
                        console.error("Sync failed:", data.msg)
                        setError(`Sync failed: ${data.msg || res.statusText}`)
                    }
                } catch (err: any) {
                    console.error("Sync error:", err)
                    setError(`Connection failed: ${err.message}. Is the backend running?`)
                }
            } else if (isLoaded && !user) {
                navigate('/login')
            }
        }

        syncUser()
    }, [isLoaded, user, role, navigate])

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Sync Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900">Setting up your profile...</h2>
                <p className="text-gray-500">Please wait while we sync your data.</p>
            </div>
        </div>
    )
}

export default AuthCallbackPage
