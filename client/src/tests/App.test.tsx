import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders with title', () => {
    render(<App />);
    expect(screen.getByText(/FileVault/i)).toBeInTheDocument();
  });
});
