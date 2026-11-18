import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ApplyPage from './page';

describe('ApplyPage', () => {
  it('renders an accessible page heading', () => {
    render(<ApplyPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: '지원' }),
    ).toBeInTheDocument();
  });
});
