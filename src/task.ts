export type Task = {
  id?: number
  content: string
  // active: -1, unfinished: 0, finished: 1
  // Why active is -1? Because it is easier to sort
  // Why use -1, 0, 1 instead of 0, 1, 2? Because... why not?
  status: number
  spaceId?: string
}

export type Space = {
  id: string
  name: string
}
