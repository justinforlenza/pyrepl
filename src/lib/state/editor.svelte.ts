class EditorState {
  value = $state('')
  readOnly = $state(false)
}


const editor = new EditorState()

export { editor }