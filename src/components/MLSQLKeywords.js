class MLSQLKeywords {
  constructor(holder) {
    this._holder = holder
  }

  register() {
    const load_completer = {
      identifierRegexps: [/[^\s]+/],
      getCompletions: function (editor, session, pos, prefix, callback) {
        callback(
          null,
          MLSQLKeywords.keywords().filter(entry => {
            return entry.includes(prefix);
          }).map(entry => {
            return {
              value: entry,
              meta: "code"
            };
          })
        );
      }
    }

    this._holder.lang_tools().addCompleter(load_completer)
  }

  static keywords() {
    return [
      "load",
      "save",
      "train",
      "register",
      "options",
      "connect",
      "options",
      "partitionBy",
      "append",
      "overwrite",
      "errorIfExists",
      'ignore'
    ]
  }
}

export default MLSQLKeywords

