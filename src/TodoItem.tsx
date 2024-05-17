import React from 'react'
import { useRef, useState } from 'react'
import { ITodo, TodoService } from './services/todo.service'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { StateService } from './services/state.service'

export interface ITodoItemProps {
  todo: ITodo
  onEdit?(todo: ITodo): void
  onSave?(todo: ITodo): void
  onCancel?(): void
}

export default function TodoItem(props: ITodoItemProps) {
  const { todo } = props

  const [inputValue, setInputValue] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  const stateService = useDependency(StateService)!
  const todoService = useDependency(TodoService)!

  const handleEdit = () => {
    setInputValue(todo.title)

    stateService.setEditing(todo.id)

    setTimeout(() => {
      inputRef?.current!.focus()
    }, 16)
  }

  const handleSubmit = function (e: KeyboardEvent) {
    const val = inputValue.trim()

    stateService?.setEditing('')

    if (val) {
      setInputValue(val)
      todoService?.save(todo, val)
    } else {
      todoService?.destroy(todo)
    }
  }

  const handleKeydown = function (e: KeyboardEvent) {
    if (e.code === 'Escape') {
      setInputValue(todo.title)
    } else if (e.code === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <li
      className={`${todo.completed && 'completed'} ${
        stateService.editing === todo.id && ' editing'
      }`}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={todo.completed}
          onChange={() => todoService?.toggle(todo)}
        />
        <label onDoubleClick={() => handleEdit()}>{todo.title}</label>
        <button
          className="destroy"
          onClick={() => todoService?.destroy(todo)}
        ></button>
      </div>
      <input
        ref={inputRef}
        className="edit"
        value={inputValue}
        onBlur={(e) => handleSubmit(e as unknown as any)}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => handleKeydown(e as unknown as any)}
      />
    </li>
  )
}
