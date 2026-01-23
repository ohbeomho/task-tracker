import styled from 'styled-components'

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  -webkit-appearance: none;
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: 0.25rem;
  background-color: var(--input-bg);
  margin: 0;
  cursor: pointer;
  display: grid;
  place-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &::before {
    content: '';
    width: 0.65rem;
    height: 0.65rem;
    opacity: 0;
    transition: 120ms opacity ease-in-out;
    box-shadow: inset 1em 1em var(--button-text);
    transform-origin: bottom left;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  &:checked {
    background-color: var(--button-bg);
    border-color: var(--button-bg);
  }

  &:checked::before {
    opacity: 1;
  }

  &:hover:not(:disabled) {
    border-color: var(--button-bg);
  }

  &:focus {
    outline: 2px solid var(--button-bg);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export default Checkbox
