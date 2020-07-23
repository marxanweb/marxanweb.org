/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/www.marxanweb.org
 * (see https://github.com/marxanweb/www.marxanweb.org).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
