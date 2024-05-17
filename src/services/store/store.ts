import {createIdentifier} from '@wendellhu/redi'

export interface IStoreService {
    store(namespace: string): any
    store(namespace: string, data: any): void
}

export const IStoreService = createIdentifier<IStoreService>('store-service')