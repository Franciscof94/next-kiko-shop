import 'styled-components'
import darkTheme from './lightTheme'

export type Theme = typeof darkTheme

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}