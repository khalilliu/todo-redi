import { Inject } from '@wendellhu/redi'
import { Subject } from 'rxjs'
import { SHOWING, StateService } from './state.service'
import { IStoreService } from './store/store'
import { uuid } from '../utils/uuid'

export interface ITodo {
  id: string
  title: string
  completed: boolean
}

export const TODO_STORAGE_KEY = 'TODO'

export class TodoService {
  todos: ITodo[] = []
  update$ = new Subject<void>()

  constructor(
    @Inject(StateService) private stateService: StateService,
    @IStoreService private storeService: IStoreService
  ) {
    this.todos = this.storeService.store(TODO_STORAGE_KEY)
  }

  get shownTodos(): ITodo[] {
    return this.todos.filter((todo) => {
      switch (this.stateService.showing) {
        case SHOWING.ACTIVE_TODOS:
          return !todo.completed
        case SHOWING.COMPLETED_TODOS:
          return todo.completed
        default:
          return true
      }
    })
  }

  get todoCount(): number {
    return this.todos.length
  }

  get activeTodoCount(): number {
    return this.todos.reduce((acc, todo) => (todo.completed ? acc : acc + 1), 0)
  }

  get completedCount(): number {
    return this.todos.length - this.activeTodoCount
  }

  inform() {
    this.storeService.store(TODO_STORAGE_KEY, this.todos)
    this.update$.next()
  }

  addTodo(title: string): void {
    const newTodo: ITodo = {
      id: uuid(),
      title,
      completed: false,
    }
    this.todos.push(newTodo)
    this.inform()
  }

  toggleAll(checked: boolean): void {
    this.todos = this.todos.map((todo) => ({ ...todo, completed: checked }))

    this.inform()
  }

  toggle({ id }: ITodo) {
    this.todos = this.todos.map<ITodo>((item: ITodo) => {
      return item.id !== id ? item : { ...item, completed: !item.completed }
    })

    this.inform()
  }

  destroy({ id }: ITodo) {
    this.todos = this.todos.filter((candidate) => candidate.id !== id)

    this.inform()
  }

  save({ id }: ITodo, text: string) {
    this.todos = this.todos.map((todo) =>
      todo.id !== id ? todo : { ...todo, title: text }
    )

    this.inform()
  }

  clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.completed)

    this.inform()
  }
}
