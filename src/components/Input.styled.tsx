import styled from 'styled-components'

const Input = styled.input`
  all: unset;
  width: 100%;
  padding: 0.75rem 1rem;
  margin: 0.25rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--input-bg);
  color: var(--input-text);
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &::placeholder {
    opacity: 0.7;
  }

  &:hover {
    border-color: var(--button-bg);
    box-shadow: 0 0 0 1px var(--button-bg);
  }

  &:focus {
    outline: none;
    border-color: var(--button-bg);
    box-shadow: 0 0 0 2px var(--button-bg);
  }
`

export default Input
