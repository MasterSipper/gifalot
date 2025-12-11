import { render } from '@testing-library/react';
import { App } from './App';

test('renders app without crashing', () => {
  render(<App />);
  // App renders RouterProvider which handles routing
  // This test just ensures the app doesn't crash on render
});
