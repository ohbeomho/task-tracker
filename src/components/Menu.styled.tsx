import styled from 'styled-components'

const Menu = styled.div`
  background-color: var(--bg-color);
  max-height: 0px;
  height: 100vh;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: var(--bg-color);
  position: relative;

  & > div {
    backdrop-filter: brightness(1.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 0rem;
    width: 100%;
    height: 100%;
    transition: all 0.3s ease;
  }

  &.open {
    max-height: calc(100svh - 5rem);
    overflow: auto;
  }

  &.open > div {
    padding: 1rem;
  }

  & > h1 {
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    padding: 1rem;
    margin: 0;
  }
`

export default Menu
