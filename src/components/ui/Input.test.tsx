import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';
import { createRef } from 'react';
import { Mail } from 'lucide-react';

describe('Input Component', () => {
  it('renders correctly with basic props', () => {
    render(<Input placeholder="Enter your name" name="name" />);
    const input = screen.getByPlaceholderText('Enter your name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'name');
  });

  it('renders label and associates it with input', () => {
    render(<Input label="Username" id="username-field" />);
    const label = screen.getByText('Username');
    const input = screen.getByLabelText('Username');

    expect(label).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'username-field');
    expect(label).toHaveAttribute('for', 'username-field');
  });

  it('generates an id from label if not provided', () => {
    render(<Input label="Email Address" />);
    const input = screen.getByLabelText('Email Address');
    expect(input.id).toBe('input-email-address');
  });

  it('renders icon when provided', () => {
    render(<Input icon={<Mail data-testid="mail-icon" />} />);
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
  });

  it('renders error message and applies error styling', () => {
    const errorMessage = 'Invalid email';
    render(<Input error={errorMessage} />);

    const errorText = screen.getByText(errorMessage);
    const input = screen.getByRole('textbox');

    expect(errorText).toBeInTheDocument();
    expect(errorText).toHaveAttribute('role', 'alert');
    expect(input).toHaveClass('border-red-500');
  });

  it('toggles password visibility', () => {
    render(<Input type="password" label="Password" />);
    const input = screen.getByLabelText('Password');

    // Initially password type
    expect(input).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByLabelText('Show password');
    expect(toggleButton).toBeInTheDocument();

    // Click to show password
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();

    // Click to hide password
    fireEvent.click(screen.getByLabelText('Hide password'));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('forwards ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} label="Test Ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.id).toBe('input-test-ref');
  });

  it('calls onChange handler when value changes', () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} placeholder="Change me" />);
    const input = screen.getByPlaceholderText('Change me');

    fireEvent.change(input, { target: { value: 'new value' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
