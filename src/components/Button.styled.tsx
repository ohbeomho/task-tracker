import styled from 'styled-components'

const Button = styled.button`
  all: unset;
  padding: 0.4rem;
  margin: 0.1rem;
  border: 2px solid rgb(10, 10, 10);
  border-radius: 0.4rem;
  transition: all 0.2s;
  user-select: none;
  cursor: pointer;

  &:not(:disabled):hover {
    background-color: rgb(10, 10, 10);
    color: white;
  }

  &:disabled {
    color: gray;
    border-color: gray;
    cursor: default;
  }
`

export default Button
