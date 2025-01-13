import { describe, it, expect, test, vi } from 'vitest'

import PuzzleBoard from '@/components/Puzzle/PuzzleBoard.vue'

import { customMount } from '@/utils/test.utils'

describe('<PuzzleBoard />', () => {
  it('should render component properly', () => {
    const wrapper = customMount(PuzzleBoard)

    expect(wrapper.text()).toContain('Image Preview')
  })

  test('clicking the new game button', async () => {
    const wrapper = customMount(PuzzleBoard)

    // Spy on the method
    const createNewGameSpy = vi.spyOn(wrapper.vm as InstanceType<typeof PuzzleBoard>, 'restartGame')

    const button = wrapper.find({ ref: 'newGameBtn' })
    expect(button.exists()).toBe(true)
    await button.trigger('click')

    expect(createNewGameSpy).toHaveBeenCalled()
  })

  test('clicking the reshuffle button', async () => {
    const wrapper = customMount(PuzzleBoard)

    // Spy on the method
    const createNewGameSpy = vi.spyOn(
      wrapper.vm as InstanceType<typeof PuzzleBoard>,
      'shuffleTiles',
    )

    const button = wrapper.find({ ref: 'reshuffleBtn' })
    expect(button.exists()).toBe(true)
    await button.trigger('click')

    expect(createNewGameSpy).toHaveBeenCalled()
  })
})
