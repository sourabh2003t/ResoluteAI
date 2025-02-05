// Next Imports
import { Inter } from 'next/font/google'

// Theme Options Imports
import overrides from './overrides'
import colorSchemes from './colorSchemes'
import spacing from './spacing'
import shadows from './shadows'
import customShadows from './customShadows'
import typography from './typography'

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] })

const theme = (mode, direction) => {
  return {
    direction,
    components: overrides(),
    colorSchemes: colorSchemes(),
    ...spacing,
    shape: {
      borderRadius: 6,
      customBorderRadius: {
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10
      }
    },
    shadows: shadows(mode),
    typography: typography(inter.style.fontFamily),
    customShadows: customShadows(mode),
    mainColorChannels: {
      light: '46 38 61'
    }
  }
}

export default theme
