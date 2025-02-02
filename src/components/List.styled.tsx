import styled from 'styled-components'

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const TaskListItem = styled.li.attrs<{ $done?: boolean }>((props) => ({
  $done: props.$done || false,
}))`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(240, 240, 240);
  padding: 0.4rem;

  &:nth-child(even) {
    background-color: rgb(225, 225, 225);
  }

  &:first-child {
    border-radius: 0.4rem 0.4rem 0px 0px;
  }

  &:last-child {
    border-radius: 0px 0px 0.4rem 0.4rem;
  }

  & label {
    text-decoration: ${(props) => (props.$done ? 'line-through' : 'none')};
    color: ${(props) => (props.$done ? 'gray' : 'inherit')};
  }
`

export { TaskList, TaskListItem }
