import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { withUt } from "uploadthing/tw";

export default withUt({
  content: ["./src/**/*.tsx", "./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      backgroundImage: {
        'gradient-linear': 'linear-gradient(90deg, #406EF7 0%, #C115E9 100%)',
      },
      fontWeight: {
        'extraextrabold': '900',
      },
    },
  },
  plugins: [],
}) satisfies Config;
