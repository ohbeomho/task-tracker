import styled from 'styled-components'

const TaskList = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: var(--shadow);
`

const TaskListItem = styled.li.attrs<{ $done?: boolean }>((props) => ({
  $done: props.$done || false,
}))`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  background-color: var(--task-bg);
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }

  & > div:first-child {
    padding: 0.25rem 0;
    text-decoration: ${(props) => (props.$done ? 'line-through' : 'none')};
    color: ${(props) => (props.$done ? 'var(--task-done)' : 'var(--text-color)')};
    line-break: anywhere;
    word-break: break-word;
    opacity: ${(props) => (props.$done ? 0.8 : 1)};
  }

  & > div:last-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.5rem;
    margin-top: 0.25rem;
  }
`

const TaskContentInput = styled.input`
  all: unset;
  width: 100%;
  padding: 0.5rem 0;
  border-bottom: 2px solid var(--border-color);
  margin: 0.25rem 0;
  color: var(--input-text);
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-bottom-color: var(--button-bg);
  }
`

export { TaskList, TaskListItem, TaskContentInput }
