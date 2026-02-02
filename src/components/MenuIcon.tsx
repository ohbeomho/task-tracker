import styled from 'styled-components'

const MenuButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 5px;
  background-color: var(--bg-color);
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`

const MenuLine = styled.span`
  display: block;
  width: 100%;
  height: 3px;
  background-color: var(--text-color);
  border-radius: 3px;
  transition: all 0.3s ease;
`

interface MenuIconProps {
  isOpen: boolean
  onClick: () => void
}

const MenuIcon = ({ isOpen, onClick }: MenuIconProps) => {
  return (
    <MenuButton
      className="menu-icon"
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <MenuLine
        style={{
          transform: isOpen ? 'rotate(45deg) translate(8px, 6px)' : 'none',
        }}
      />
      <MenuLine
        style={{
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? 'translateX(-20px)' : 'none',
        }}
      />
      <MenuLine
        style={{
          transform: isOpen ? 'rotate(-45deg) translate(8px, -6px)' : 'none',
        }}
      />
    </MenuButton>
  )
}

export default MenuIcon
