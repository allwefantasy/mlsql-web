const S = require('string')

class MLSQLTrainCompleter {
  constructor(main) {
    this.main = main
    this._holder = main.holder
  }

  register() {
    const holder = this._holder
    const editor = this._holder.editor()
    const session = editor.getSession()
    // editor.on('guttermousedown',function (e) {
    //   console.log(holder.tool().selection())
    // })
  }

  getTrainLine() {
    const ace = this._holder.ace()
    const Range = ace.acequire('ace/range').Range

    const editor = this._holder.editor()
    const session = editor.getSession()

    const cursorPos = editor.getCursorPosition()
    const text = session.getTextRange(new Range(0, 0, cursorPos.row, cursorPos.column))

    console.log(S(text).split(";"))

    // session.replace(new Range(pos.row, 0, pos.row, pos.column),
    //   "train [tableName] [moduleName].`[path]` where [key]=[value];\n")
    console.log(text)

  }

  isTrain() {

  }
}

export default MLSQLTrainCompleter
