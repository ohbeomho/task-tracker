import styled from 'styled-components'

const Input = styled.input`
  all: unset;
  padding: 0.4rem;
  margin: 0.1rem;
  border: 2px solid rgb(10, 10, 10);
  border-radius: 0.4rem;
  transition: all 0.2s;

  &:hover,
  &:focus {
    border-color: rgb(150, 150, 150);
  }
`

export default Input
