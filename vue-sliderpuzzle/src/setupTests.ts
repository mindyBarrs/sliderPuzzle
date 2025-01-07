import { expect } from 'vitest'
import matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's `expect` with Jest's DOM matchers
expect.extend(matchers)
