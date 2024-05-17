import React from 'react'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { TodoService } from './services/todo.service'
import { SHOWING, StateService } from './services/state.service'
import { pluralize } from './utils/pluralize'

export default function Footer() {
  const stateService = useDependency(StateService)!
  const todoService = useDependency(TodoService)!

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{todoService.activeTodoCount}</strong>{' '}
        {pluralize(todoService.activeTodoCount, 'item')} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={
              stateService.showing === SHOWING.ALL_TODOS ? 'selected' : ''
            }
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={
              stateService.showing === SHOWING.ACTIVE_TODOS ? 'selected' : ''
            }
          >
            Active
          </a>
        </li>{' '}
        <li>
          <a
            href="#/completed"
            className={
              stateService.showing === SHOWING.COMPLETED_TODOS ? 'selected' : ''
            }
          >
            Completed
          </a>
        </li>
      </ul>
      {todoService.completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={() => todoService.clearCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  )
}
