/** @type {import('tailwindcss').Config} */
// Tailwind CSS configuration file - Customizes theme, colors, fonts, and animations
export default {
  // Content paths for Tailwind to scan and generate CSS
  content: [
    "./index.html", // Main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // All source files in src directory
  ],
  theme: {
    extend: {
      // Custom color palette for agricultural marketplace theme
      colors: {
        // Primary green colors for farming and nature theme
        primary: {
          50: '#f0fdf4', // Lightest green
          100: '#dcfce7', // Very light green
          200: '#bbf7d0', // Light green
          300: '#86efac', // Medium light green
          400: '#4ade80', // Medium green
          500: '#22c55e', // Base green
          600: '#16a34a', // Medium dark green
          700: '#15803d', // Dark green
          800: '#166534', // Very dark green
          900: '#14532d', // Darkest green
        },
        // Earth tones for natural and organic feel
        earth: {
          50: '#fefce8', // Lightest yellow
          100: '#fef9c3', // Very light yellow
          200: '#fef08a', // Light yellow
          300: '#fde047', // Medium light yellow
          400: '#facc15', // Medium yellow
          500: '#eab308', // Base yellow
          600: '#ca8a04', // Medium dark yellow
          700: '#a16207', // Dark yellow
          800: '#854d0e', // Very dark yellow
          900: '#713f12', // Darkest yellow
        },
        // Brown tones for soil and earth elements
        brown: {
          50: '#fdf8f6', // Lightest brown
          100: '#f2e8e5', // Very light brown
          200: '#dae0e2', // Light brown
          300: '#c7d2d7', // Medium light brown
          400: '#a8b5bd', // Medium brown
          500: '#8b9aa3', // Base brown
          600: '#6b7c87', // Medium dark brown
          700: '#5a6b75', // Dark brown
          800: '#4a5a63', // Very dark brown
          900: '#3d4a52', // Darkest brown
        }
      },
      // Custom font families for consistent typography
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'], // Body text font
        'display': ['Poppins', 'system-ui', 'sans-serif'], // Heading and display font
      },
      // Custom animations for enhanced user experience
      animation: {
        'float': 'float 6s ease-in-out infinite', // Floating animation for elements
        'bounce-slow': 'bounce 3s infinite', // Slow bounce animation
        'fade-in': 'fadeIn 0.5s ease-in-out', // Fade in animation
        'slide-up': 'slideUp 0.5s ease-out', // Slide up animation
      },
      // Keyframe definitions for custom animations
      keyframes: {
        // Floating animation - gentle up and down movement
        float: {
          '0%, 100%': { transform: 'translateY(0px)' }, // Start and end position
          '50%': { transform: 'translateY(-20px)' }, // Middle position (up)
        },
        // Fade in animation - opacity and slide up effect
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' }, // Start: invisible and below
          '100%': { opacity: '1', transform: 'translateY(0)' }, // End: visible and in position
        },
        // Slide up animation - slide up from below
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' }, // Start: invisible and below
          '100%': { opacity: '1', transform: 'translateY(0)' }, // End: visible and in position
        }
      }
    },
  },
  plugins: [],
}
