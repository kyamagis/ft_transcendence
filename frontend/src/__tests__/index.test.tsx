import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

import LandingPage from '@/app/page'

describe('Landing Page', () => {
  it('should show OK when click button', async () => {
    render(<LandingPage />)

    await act(async () => {
      userEvent.click(screen.getByText('Click'))
    })

    await act(async () => {
      waitFor(() => expect(screen.getByText('OK')).toBeInTheDocument())
    })
  })
})
