$(document).ready(() => {
  let terminal = $("#terminal-input-window");
  let username = "badsh";
  let prompt = `${username}@term >`;
  let path = "home";
  let currentCommand = "";
  let currentDir = "home";
  let parentDir = "/";

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
      { "name": "cat",    "function": cat },
  ];

  const dirs = [
    { name: 'home', isDir: true, 
      'files': [
        { name: 'projects',    isDir: true },
        { name: 'blog',        isDir: true },
        { name: 'about.txt',   isDir: false }, 
        { name: 'resume.pdf',  isDir: false }, 
        { name: 'contact.txt', isDir: false },
      ] 
    },
    { name: 'projects', isDir: true, 
      'files': [
        { name: "Project A", isDir: false, description: "desc A", link: "google.ca"},
        { name: "Project B", isDir: false, description: "desc B", link: "google.ca"},
        { name: "Project C", isDir: false, description: "desc C", link: "google.ca"}
      ]
    },
    { name: 'blog', isDir: true, 
      'files': [
        { name: "Blog article A", isDir: false, link: "google.ca"},
        { name: "Blog article B", isDir: false, link: "google.ca"},
        { name: "Blog article C", isDir: false, link: "google.ca"}
      ]
    },
    { name: 'test', isDir: true, 
      'files': [
        { name: "Project A", isDir: false, description: "desc A", link: "google.ca"},
        { name: "Project B", isDir: false, description: "desc B", link: "google.ca"},
        { name: "Project C", isDir: false, description: "desc C", link: "google.ca"}
      ]
    } 
  ];

  function doesFileExist(dirName) {
    let exists = false;
    dirs.map((dir) => {
      dir.files.map((file) => {
        if (file.name.toLowerCase().trim() === dirName.toLowerCase().trim()) {
          exists = true;
        }
      })
    });
    return exists;
  }

  function isDir(fileName) {
    let isDir = false;
    dirs.map((dir) => {
      dir.files.map((file) => {
        if (file.name.toLowerCase().trim() === fileName.toLowerCase().trim() && file.isDir) {
          isDir = true;
        }
      })
    });
    return isDir;
  }

  function changeDir(dirName) {
    if (dirName === undefined || dirName.length === 0 || dirName[0] === "" || dirName.length >= 2) {
      terminal.append("cd: please enter a single directory name \n");
      return;
    }

    dirName = dirName[0].trim();

    if (dirName === "..") {
      console.log(currentDir);
      currentDir = parentDir;
      path = currentDir;
      parentDir = "home";
      listDir("");
    }
    else if (dirName === ".") listDir("");
    else if (doesFileExist(dirName)) {
      if (!isDir(dirName)) terminal.append(`cd: ${dirName}: Not a directory\n`);
      else { // A directory
        currentDir = dirName;
        path = currentDir;
        parentDir = "home";
        listDir("");
        return;
      }
    } else terminal.append(`cd: ${dirName}: No such file or directory \n`);
  }

  function catFile(fileName) {
    switch(fileName) {
      case 'about.txt': {
        terminal.append(`cat about.txt\n`);
        break;
      }
      case 'resume.pdf': {
        terminal.append(`cat resume.txt\n`);
        break;
      }
      case 'contact.txt': {
        terminal.append(`cat contact.txt\n`);
        break;
      }
      default: {
        break;
      }
    }
  }

  function cat(fileName) {
    if (fileName === undefined || fileName.length === 0 || fileName[0] === "" || fileName.length >= 2) {
      terminal.append("cat: please enter a single file name\n");
      return;
    } else if (doesFileExist(fileName[0])) {
      fileName = fileName[0];
      if (isDir(fileName)) terminal.append(`cat: ${fileName}: Is a directory\n`);
      else catFile(fileName); // Cat a file
    } else terminal.append(`cat: ${fileName}: No such file or directory \n`);
  }

  function list(dirName) {
    dirs.forEach((dir, idx) => { // Regular directory
      if (dir.name === dirName) { // Listing the directory requested
        terminal.append('\n');
        dir.files.forEach((file, idx) => {
          if (file.isDir) terminal.append(`<span id="dir">${file.name}</span>\n`);
          else terminal.append(`${file.name}\n`);
        });
      }
    });
    terminal.append('\n');
  }

  function listDir(dirName) {
    if (dirName.length >= 2) {
      terminal.append("ls: can only list one directory at a time \n");
      return;
    }

    // List current directory if no arguments are given
    if (dirName === undefined || dirName.length === 0) { 
      dirName = currentDir;
      list(dirName);
    } else if (dirName.length === 1) { // 1 argument
      dirName = dirName[0];

      if (dirName === ".") list(currentDir);
      else if (dirName === "..") list(parentDir)
      else if (!doesFileExist(dirName)) { // If file does not exist
        terminal.append(`ls: cannot access '${dirName}': No such file or directory \n`);
      } else { // File exists, can either be a directory or a file
        if (!isDir(dirName)) terminal.append(`${dirName}\n`);
        else list(dirName); // A directory
      }
    }
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
    terminal.append(`<span id="path">${path}</span> `);
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