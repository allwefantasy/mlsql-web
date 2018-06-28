class EditorMethods {
  constructor(holder) {
    this._holder = holder
  }

  selection() {
    const ace_editor = this._holder.editor()
    let selectionRange = ace_editor.getSelectionRange()
    let content = ace_editor.session.getTextRange(selectionRange);
    return content
  }

}

class MLSQLEditorHolder {
  constructor(context) {
    this._ace = require("brace")
    const vm = context.$children.filter(function (item) {
      return item.$options._componentTag === "editor"
    })[0]
    this._editor = vm.editor
    this._lang_tool = this._ace.acequire("ace/ext/language_tools")
    this._tool = new EditorMethods(this)

  }

  tool() {
    return this._tool
  }

  editor() {
    return this._editor
  }

  lang_tools() {
    return this._lang_tool
  }

  ace() {
    return this._ace
  }
}

export default MLSQLEditorHolder
