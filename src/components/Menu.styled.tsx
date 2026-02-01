import styled from 'styled-components'

const Menu = styled.div`
  background-color: var(--bg-color);
  max-height: 0px;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: var(--bg-color);

  & > div {
    backdrop-filter: brightness(1.2);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    padding: 0rem;
    width: 100%;
    height: 100%;
    transition: all 0.3s ease;
  }

  &.open {
    max-height: min(100vh, 400px);
  }

  &.open > div {
    padding: 1rem;
  }
`

export default Menu
