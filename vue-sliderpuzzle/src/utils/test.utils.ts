/* eslint-disable @typescript-eslint/no-explicit-any */

import { mount, VueWrapper } from '@vue/test-utils'
import type { MountingOptions } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing' // Optional, if using Pinia
import type { ComponentPublicInstance } from 'vue'
import { vi } from 'vitest'

/**
 * Custom mount function for Vue components with additional global properties, plugins, and mocks.
 *
 * @template T - The type of the component instance.
 * @param {any} component - The Vue component to be mounted.
 * @param {MountingOptions<any>} [options={}] - Optional mounting options to be passed to the mount function.
 * @returns {VueWrapper<T>} - The wrapper around the mounted component.
 *
 * @example
 * ```typescript
 * import { customMount } from './test.utils';
 * import MyComponent from '@/components/MyComponent.vue';
 *
 * const wrapper = customMount(MyComponent, {
 *   props: { propValue: 'test' },
 * });
 * ```
 */
export function customMount<T extends ComponentPublicInstance>(
  component: any,
  options: MountingOptions<any> = {},
): VueWrapper<T> {
  // Example of adding global properties, plugins, and mocks
  return mount(component, {
    global: {
      plugins: [
        createTestingPinia({ createSpy: vi.fn }), // Mock Pinia
      ],
      provide: {
        // Example: Mock a global provider
        myService: { fetchData: vi.fn() },
      },
      mocks: {
        $t: (msg: string) => msg, // Mock translation function
      },
    },
    ...options,
  })
}
