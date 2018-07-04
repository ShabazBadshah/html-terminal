$(document).ready(() => {
  let terminal = $("#terminal-input-window");
  let username = "badsh";
  let prompt = `${username}@term >`;
  let path = "~";
  let currentCommand = "";

  const skillsList = `
- Languages: Python, Java, Javascript, C
- Frameworks: Android, React, Node, Express
- Databases: SQL, Mongo
- Libraries: jQuery, Sass, Jade (Pug)
- Version Control: Git
- Other: REST, AJAX, Bash, LaTeX, HTML, CSS
  `;

  let commands = [
      { "name": "clear",  "function": clearTerminal },
      { "name": "echo",   "function": echo },
      { "name": "help",   "function": help },
      { "name": "skills", "function": skills }
  ];

  function clearTerminal() {
    terminal.text("");
  }

  function skills() {
    terminal.append(skillsList + "\n");
  }

  function echo(args) {
    let str = args.join(" ");
    terminal.append(str + "\n");
  }

  function help() {
    let helpStr = "Supported commands: ";
    commands.forEach((command, i) => {
      helpStr += command.name;
      if (i !== commands.length - 1) helpStr += ", ";
    });

    helpStr += "\n"
    terminal.append(helpStr);
  }

  function processCommand() {
    let isValid = false;
    let args = currentCommand.split(" ");
    let cmd = args[0];

    args.shift(); // Removes and returns the first item in the array

    commands.forEach((command, i) => {
      if (cmd === command.name) {
        commands[i].function(args);
        isValid = true;
      }
    });

    if (!isValid && currentCommand !== "") terminal.append(`sh: command not found: ${currentCommand} \n`);
    currentCommand = "";
    terminal.scrollTop(terminal.prop("scrollHeight")); // Anchors the overflow to the bottom of the terminal
  }

  
  function appendCommand(str) {
    terminal.append(str);
    currentCommand += str;
  }

  function displayPrompt() {
    terminal.append(`<span class="prompt">${prompt}</span> `);
    terminal.append(`<span class="path">${path}</span> `);
  }

  function erase(n) {
    currentCommand = currentCommand.slice(0, -n);
    terminal.html(terminal.html().slice(0, -n));
  }

  // Terminal controls and spacebar control
  $(document).keydown((e) => {
    let keyCode = typeof e.which === "number" ? e.which : e.keyCode;

    // Backspace
    if (keyCode === 8) {
      e.preventDefault(); // Prevents page from going back
      if (currentCommand !== "") erase(1);
    }

    // Spacebar
    if (keyCode === 32) appendCommand(String.fromCharCode(keyCode));
  });

  // Processes new commands 
  $(document).keypress((e) => {
    let keyCode = typeof e.which === "number" ? e.which : e.keyCode;

    switch (keyCode) {
      case 13: // Enter key
        terminal.append("\n");
        processCommand();
        displayPrompt();
        break;
      default: // Any other character
        appendCommand(String.fromCharCode(keyCode));
        break;
    }
  });

  let date = new Date().toString(); 
  date = date.substr(0, date.indexOf("GMT") - 1);

  terminal.append(`Logged in as: ${username} on ${date} \n`); 
  help();
  displayPrompt();
});