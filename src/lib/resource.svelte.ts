interface ResourceState<T> {
  value: T | undefined
  pending: boolean
}

export const resource = <T>(
  fn: () => Promise<T>,
  initialValue?: T,
): ResourceState<T> => {
  const _rune = $state<ResourceState<T>>({
    value: initialValue,
    pending: true,
  })

  $effect(() => {
    fn().then((data) => {
      _rune.value = data
    })
  })

  return _rune
}
