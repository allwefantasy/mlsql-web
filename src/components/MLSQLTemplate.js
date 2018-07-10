class MLSQLTemplate {
  constructor(main) {

    this._holder = main.holder

  }

  register() {
    const holder = this._holder
    holder.editor().commands.addCommand({
      name: "expand",
      bindKey: {win: "Tab", mac: "Tab"},
      exec: function (editor) {
        let pos = editor.getCursorPosition()
        let current_line = editor.session.getLine(pos.row)
        const Range = holder.ace().acequire("ace/range").Range
        if (current_line.trim() === "load") {
          editor.session.replace(new Range(pos.row, 0, pos.row, pos.column),
            "load parquet.`[path]`\noptions [key]=[value]\nas [tableName];\n")
        }
        if (current_line.trim() === "save") {
          editor.session.replace(new Range(pos.row, 0, pos.row, pos.column),
            "save append [tableName] as parquet.`[path]`\noptions [key]=[value]\npartitionBy [column];\n")
        }
        if (current_line.trim() === "train") {
          editor.session.replace(new Range(pos.row, 0, pos.row, pos.column),
            "train [tableName] [moduleName].`[path]` where [key]=[value];\n")
        }

        if (current_line.trim() === "register") {
          editor.session.replace(new Range(pos.row, 0, pos.row, pos.column),
            "register [moduleName].`[path]` as [functionName] options [key]=[value];\n")
        }
      }
    })
  }
}

export default MLSQLTemplate
