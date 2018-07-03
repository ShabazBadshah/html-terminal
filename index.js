let terminalTextArea;

$(() => {
  terminalTextArea = $('#terminal-input');
  terminalTextArea.val(terminalTextArea.val().trim() + '> ');
  addKeyListeners();
});

function disableArrowKeys() {
  window.addEventListener("keydown", (e) => {
    // arrow keys
    if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
  });
}

function addKeyListeners() {
  disableArrowKeys();
}