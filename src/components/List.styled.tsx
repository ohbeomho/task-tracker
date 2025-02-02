import styled from 'styled-components'

const TaskList = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
`

const TaskListItem = styled.li.attrs<{ $done?: boolean }>((props) => ({
  $done: props.$done || false,
}))`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  background-color: rgb(240, 240, 240);
  padding: 0.4rem;
  width: calc(100% - 0.8rem);

  &:nth-child(even) {
    background-color: rgb(225, 225, 225);
  }

  &:first-child {
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
  }

  &:last-child {
    border-bottom-left-radius: 0.4rem;
    border-bottom-right-radius: 0.4rem;
  }

  & > div:first-child {
    padding: 0 0.2rem 0 0.2rem;
    text-decoration: ${(props) => (props.$done ? 'line-through' : 'none')};
    color: ${(props) => (props.$done ? 'gray' : 'inherit')};
    line-break: anywhere;
  }

  & > div:last-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

export { TaskList, TaskListItem }
