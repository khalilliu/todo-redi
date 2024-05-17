import React, { useEffect, useRef, useState } from 'react'
import { hot } from 'react-hot-loader'
import { connectInjector, useDependency } from '@wendellhu/redi/react-bindings'

import './App.css'

import { Injector, registerSingleton } from '@wendellhu/redi'
import { IStoreService } from './services/store/store'
import { LocalStoreService } from './services/store/store.web'
import { TodoService } from './services/todo.service'
import { StateService } from './services/state.service'
import { RouterService } from './services/router.service'
import { Observable } from 'rxjs'
import Footer from './Footer'
import TodoItem from './TodoItem'

registerSingleton(IStoreService, { useClass: LocalStoreService })

/**
 * subscribe to a signal that emits whenever data updates and re-render
 *
 * @param update$ a signal that the data the functional component depends has updated
 */
export function useUpdateBinder(update$: Observable<void>) {
  const [, dumpSet] = useState(0)

  useEffect(() => {
    const subscription = update$.subscribe(() => dumpSet((prev) => prev + 1))
    return () => subscription.unsubscribe()
  }, [])
}

function App() {
  const stateService = useDependency(StateService)!
  const todoService = useDependency(TodoService)!
  const inputRef = useRef<HTMLInputElement>(null)

  useUpdateBinder(stateService.update$.asObservable())
  useUpdateBinder(todoService.update$.asObservable())

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.code !== 'Enter') {
      return
    }
    e.preventDefault()

    const val = inputRef.current?.value

    if (val) {
      todoService.addTodo(val)
      inputRef.current!.value = ''
    }
  }

  const todoItems = todoService.shownTodos.map((todo) => (
    <TodoItem key={todo.id} todo={todo} />
  ))

  const todoPart = todoService.todoCount ? (
    <section>
      <input
        type="checkbox"
        id="toggle-all"
        className="toggle-all"
        onChange={(e) => todoService.toggleAll(e.target.checked)}
        checked={todoService.activeTodoCount === 0}
      />
      <label htmlFor="toggle-all">Mark all as completed</label>
      <ul className="todo-list">{todoItems}</ul>
    </section>
  ) : null

  const footerPart = todoService.todoCount ? <Footer></Footer> : null

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          type="text"
          ref={inputRef}
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleKeydown as unknown as any}
          autoFocus={true}
        />
      </header>
      {todoPart}
      {footerPart}
    </div>
  )
}

const AppContainer = connectInjector(
  App,
  new Injector([[TodoService], [StateService], [RouterService]])
)

export default hot(module)(() => <AppContainer />)
