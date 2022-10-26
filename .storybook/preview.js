import React from 'react'
import { ThemeProvider } from 'react-jss'
import theme from '../app/theme'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'fullscreen',
}

export const decorators = [
  Story => {
    if (typeof window.logger === 'undefined') window.logger = console
    if (typeof socket === 'undefined') window.socket = {}
    window.socket.NoSocket = true
    return (
      <ThemeProvider theme={theme}>
        <div style={{ backgroundColor: theme.backgroundColorApp }}>
          <Story />
        </div>
      </ThemeProvider>
    )
  },
]
