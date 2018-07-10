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
          MLSQLKeywords.keywords().concat(
            MLSQLKeywords.datasources(),
            MLSQLKeywords.models()
          ).filter(entry => {
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
      "ignore", ""
    ]
  }

  static datasources() {
    return [
      "parquet", "json", "csv", "image"
    ]
  }

  static models() {
    return [
      "PythonAlg", "ConfusionMatrix", "TfIdfInPlace", "RateSampler"
    ]
  }

  static functions() {
    return [
      "onehot"
    ]
  }
}

export default MLSQLKeywords

