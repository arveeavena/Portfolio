/* eslint-disable react-refresh/only-export-components -- server-only build entry, never hot-reloaded */
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { PROJECTS } from './data/projects.js'
import { FAQ } from './data/faq.js'
import { SERVICES } from './data/services.js'
import { STACK } from './data/stack.js'

export function render() {
  return renderToString(<App />)
}

export { PROJECTS, FAQ, SERVICES, STACK }
