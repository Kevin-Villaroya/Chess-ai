var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  matchBrackets: true,
  autoCloseBrackets: true,
  highlightSelectionMatches: true,
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  mode: "javascript",
  gutters: ["CodeMirror-lint-markers"],
  lint: {options: {esversion: 2021}},
});