type MaybePromise<T> = Promise<T> | T

export function asyncPipe<A, B>(ab: (a: A) => MaybePromise<B>): (a: MaybePromise<A>) => Promise<B>
export function asyncPipe<A, B, C>(ab: (a: A) => MaybePromise<B>, bc: (b: B) => MaybePromise<C>): (a: MaybePromise<A>) => Promise<C>
export function asyncPipe<A, B, C, D>(ab: (a: A) => MaybePromise<B>, bc: (b: B) => MaybePromise<C>, cd: (c: C) => MaybePromise<D>): (a: MaybePromise<A>) => Promise<D>
export function asyncPipe<A, B, C, D, E>(ab: (a: A) => MaybePromise<B>, bc: (b: B) => MaybePromise<C>, cd: (c: C) => MaybePromise<D>, de: (d: D) => MaybePromise<E>): (a: MaybePromise<A>) => Promise<E>
export function asyncPipe(...fns: Function[]) {
    return (x: any) => fns.reduce(async (y, fn) => fn(await y), x)
}