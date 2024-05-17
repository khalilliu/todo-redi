import { Inject } from '@wendellhu/redi'
import { Subject } from 'rxjs'
import { RouterService } from './router.service'

export enum SHOWING {
  ALL_TODOS,
  ACTIVE_TODOS,
  COMPLETED_TODOS,
}

export class StateService {
  showing: SHOWING = SHOWING.ALL_TODOS
  editing?: string
  update$ = new Subject<void>()

  constructor(@Inject(RouterService) private routerService: RouterService) {
    this.routerService.router$.subscribe((route) => {
      switch (route) {
        case '/active': {
          this.showing = SHOWING.ACTIVE_TODOS
          break
        }
        case '/completed': {
          this.showing = SHOWING.COMPLETED_TODOS
          break
        }
        default:
          this.showing = SHOWING.ALL_TODOS
          break
      }

      this.update()
    })
  }

  setEditing(id: string): void {
    this.editing = id
    this.update()
  }

  private update(): void {
    this.update$.next()
  }
}
