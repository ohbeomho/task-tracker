import styled from 'styled-components'

const Button = styled.button`
  all: unset;
  padding: 0.5rem 1rem;
  margin: 0.1rem;
  border: 2px solid var(--button-bg);
  border-radius: 0.5rem;
  background-color: var(--button-bg);
  color: var(--button-text);
  font-weight: 500;
  transition: all 0.2s;
  user-select: none;
  cursor: pointer;
  box-shadow: var(--shadow);

  &:not(:disabled):hover {
    background-color: var(--button-hover);
    border-color: var(--button-hover);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--button-bg);
    border-color: var(--button-bg);
  }
`

export default Button
