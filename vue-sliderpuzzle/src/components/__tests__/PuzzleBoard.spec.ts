import { describe, it, expect, test } from 'vitest'

import PuzzleBoard from '@/components/Puzzle/PuzzleBoard.vue'

import { customMount } from '@/utils/test.utils'

describe('<PuzzleBoard />', () => {
  it('should render component properly', () => {
    const wrapper = customMount(PuzzleBoard)

    expect(wrapper.text()).toContain('Image Preview')
  })

  test('clicking the reshuffle', async () => {
    const wrapper = customMount(PuzzleBoard)

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    await button.trigger('click')

    expect(wrapper.emitted('gameStart')).toBeTruthy()
  })
})
