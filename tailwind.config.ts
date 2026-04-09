import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Source Serif 4", "serif"],
      },
      colors: {
        // ── Bandeira do Brasil ─────────────────────────────────────────────────
        "brasil-green": "#009C3B",
        "brasil-green-light": "#00B844",
        "brasil-green-dark": "#007A2E",
        "brasil-yellow": "#FFDF00",
        "brasil-yellow-light": "#FFE840",
        "brasil-yellow-dark": "#D4B800",
        "brasil-blue": "#002776",
        "brasil-blue-mid": "#003DA5",
        "brasil-blue-dark": "#001A56",

        // Brand palette (kept for legacy compatibility)
        brand: {
          blue: {
            50: "#EFF6FF",
            100: "#DBEAFE",
            200: "#BFDBFE",
            300: "#93C5FD",
            400: "#60A5FA",
            500: "#3B82F6",
            600: "#002776",
            700: "#001A56",
            800: "#001240",
            900: "#000C2E",
          },
          green: {
            50: "#E8FFF0",
            100: "#C2F5D4",
            200: "#85EBA8",
            300: "#47E07C",
            400: "#00D04E",
            500: "#009C3B",
            600: "#007A2E",
            700: "#005A22",
            800: "#003D17",
            900: "#00200C",
          },
          yellow: {
            50: "#FFFCE8",
            100: "#FFF7C2",
            200: "#FFEE85",
            300: "#FFE347",
            400: "#FFDF00",
            500: "#D4B800",
            600: "#A89200",
            700: "#7C6C00",
          },
        },

        // Sidebar uses brasil-blue-dark
        sidebar: "#001A56",
        "sidebar-hover": "#002776",
        "sidebar-active": "#003DA5",

        // ── Brasil shorthand aliases ───────────────────────────────────────
        "brasil-blue": "#002776",
        "brasil-blue-mid": "#003DA5",
        "brasil-blue-dark": "#001A56",
        "brasil-green": "#009C3B",
        "brasil-green-light": "#00B844",
        "brasil-green-dark": "#007A2E",
        "brasil-yellow": "#FFDF00",
        "brasil-yellow-light": "#FFE840",
        "brasil-yellow-dark": "#D4B800",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-green": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0,156,59,0.4)" },
          "50%": { boxShadow: "0 0 0 6px rgba(0,156,59,0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.2s ease-out",
        "pulse-green": "pulse-green 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
