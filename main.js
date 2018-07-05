$(document).ready(() => {
  let terminal = $("#terminal-input-window");
  let username = "badsh";
  let prompt = `${username}@term >`;
  let path = "~";
  let currentCommand = "";
  let currentDir = "home";
  let currentDirFolders = [];

  const skillsList = `
- Languages:  Python, Java, Javascript, C
- Frameworks: Android, React, Node, Express
- Databases:  SQL, Mongo
- Libraries:  jQuery, Sass, Jade (Pug)
- Other:      REST, AJAX, Bash, LaTeX, HTML, CSS
- VC:         Git
  `;

  let commands = [
      { "name": "clear",  "function": clearTerminal },
      { "name": "echo",   "function": echo },
      { "name": "help",   "function": help },
      { "name": "skills", "function": skills },
      { "name": "ls",     "function": listDir },
      { "name": "cd",     "function": changeDir },
  ];

  const dirs = [
    { name: 'home', 'files': ['about.txt', 'resume.pdf', 'contact.txt', 'projects', 'blog'] },
    { name: 'projects', 'files': 
      [
        { name: "Project A", description: "desc A", link: "google.ca"},
        { name: "Project B", description: "desc A", link: "google.ca"},
        { name: "Project C", description: "desc A", link: "google.ca"}
      ]
    },
    { name: 'blog', 'files': 
      [
        { name: "Blog article A", link: "google.ca"},
        { name: "Blog article B", link: "google.ca"},
        { name: "Blog article C", link: "google.ca"}
      ]
    },
  ]

  function changeDir(dirName) {

  }

  function isDir(dirName) {
    return currentDirFolders.some((file) => {
      return file.name === dirName;
    }); 
  }

  function listDir(dirName) {

    if (dirName.length >= 2) {
      terminal.append("ls: can only list directories \n");
      return;
    }

    // List current directory if no arguments are given
    if (dirName === undefined || dirName.length === 0) dirName = currentDir;
    else dirName = dirName[0];
    // console.log(dirName);

    // Get list of all files that are directories
    dirs.forEach((dir, idx) => {
      currentDirFolders.push(dir);
    });

    // if (isDir(dirName)) { // Directory 

    // }

    // List files
    dirs.forEach((dir, idx) => { // Regular directory
      if (dir.name === dirName) { // List directory
        
        dir.files.forEach((file, idx) => {
          // If the file is a directory
          if (isDir(file)) terminal.append(`<span id="dir">${file}</span> `);
          // Normal file
          else terminal.append(`${file} `);
          // New line after listing last file
          if (idx === dir.files.length - 1) terminal.append('\n'); 
        });
      }
    });
    currentDirFolders = [];
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

    if (!isValid && currentCommand !== "") terminal.append(`/bin/sh: command not found: ${currentCommand} \ntype 'help' for all supported commands \n`);
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

  function erase(amountCharsToErase) {
    currentCommand = currentCommand.slice(0, -amountCharsToErase);
    terminal.html(terminal.html().slice(0, -amountCharsToErase));
  }

  function clearTerminal() {
    terminal.text("");
    help();
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