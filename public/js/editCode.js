var oldFileDom = null;
var fileDom = null;

var fileSelected = null;
var folderSelected = null;
var pathFolder = null;

const contextMenu = document.getElementById('context-menu');

/* ========================= INIT LISTENERS =========================*/

document.getElementById('files-container').addEventListener('contextmenu', function(e){
  displayContextMenu(e);

  setFolderSelected();
  setFileSelected();
});

document.getElementById('files-container').addEventListener('mousedown', function(e){
  setFolderSelected();
  setFileSelected();
});

document.getElementById('body').addEventListener('click', function(e){
  hideContextMenu(e);
});

/* ========================= SET PARAMETERS TEST =========================*/

var parameters = {color : "white", "type" : "Player"}
var titleSelected = document.getElementById("PlayerOptionTitle");
var parametersSelected = document.getElementById("whiteOption");

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closePopup();
  }
});

function test(){
  let popup = document.getElementById("testParameterPopup");

  if(fileSelected == null){
    return;
  }

  if(popup.classList.contains("open")){
    popup.classList.remove("open");
  }else{
    popup.classList.add("open");
  }
}

function closePopup(){
  let popup = document.getElementById("testParameterPopup");
  popup.classList.remove("open");
}

function setParameterTestColor(color){
  parameters.color = color;
}

function launchTest(){
  let pathFolderString = "";

  for(let folder of pathFolder){
    pathFolderString += folder + ":";
  }

  let url = '/play/test/' + parameters.type + '/' + parameters.color + '/' + pathFolderString + fileSelected;

  window.location.href = url;
}

function setSelectedType(element, type){
  titleSelected.classList.remove("selected");

  element.classList.add("selected");
  parameters.type = type;

  titleSelected = element;
}

function setSelectedParameter(element, color){
  parametersSelected.classList.remove("selected");

  element.classList.add("selected");
  parameters.color = color;

  parametersSelected = element;
}

/* ========================= SET FILES METHODS =========================*/

function getFile(path, fileName){
  let folder = getFolder(path);

  for(let child of folder.children){
    if(child.id == fileName){
      return child;
    }
  }

  return null;
}

function getFolder(path){
  let element = document.getElementById("files-container");
  let i = 0;

  while(i < path.length && element != null){
    for(let child of element.children){
      if(child.id == path[i]){
        element = child;
        break;
      }
    }
    i++;
  }

  return element;
}

function renameElement(path, fileName, newName){
  let elementToRename;
  let classContent;
  let classname;

  if(fileName == null){
    elementToRename = getFolder(path);

    classContent = 'folder-code-content';
    classname = 'folder-code-name';

  }else{
    elementToRename = getFile(path, fileName);

    classContent = 'file-code-content';
    classname = 'file-code-name';
    classImage = 'file-code-image';
  }

  if(elementToRename != null){
    elementToRename.id = newName;

    for(let child of elementToRename.children){
      if(child.classList.contains(classContent)){

        for(let child2 of child.children){
          if(child2.classList.contains(classname)){
            child2.innerHTML = newName;
          }

          if(child2.classList.contains(classImage)){
            child2.id = newName + 'Image';
          }
        }
      }
    }
  }
}

function displayContextMenu(e){
  e.preventDefault();

  let x = e.clientX;
  let y = e.clientY;

  contextMenu.classList.remove('closed');
  contextMenu.classList.add('open');

  const scopeX = document.getElementById('body').offsetLeft;
  const scopeY = document.getElementById('body').offsetTop;

  const sizeContextHeight = contextMenu.offsetHeight;

  if(y + sizeContextHeight > scopeY + window.innerHeight){
    y = scopeY + window.innerHeight - sizeContextHeight;
  }

  contextMenu.style.left = x + 'px';
  contextMenu.style.top = y + 'px';
}

function setFolderSelected(){
  let hoverElements = document.querySelectorAll( ":hover" );

  for(let i = hoverElements.length - 1; i >= 0; i--){
    if(hoverElements[i].classList.contains('folder-code') && hoverElements[i].classList.contains('open')){
      folderSelected = hoverElements[i].id;
      break;
    }
  }

  pathFolder = new Array();

  for(let i = 0; i < hoverElements.length; i++){
    if(hoverElements[i].classList.contains('folder-code') && hoverElements[i].classList.contains('open')){
      pathFolder.push(hoverElements[i].id);
    }
  }
}

function setFileSelected(){
  let hoverElements = document.querySelectorAll( ":hover" );
  let find = false;

  for(let i = hoverElements.length - 1; i >= 0; i--){
    if(hoverElements[i].classList.contains('file-code')){
      fileSelected = hoverElements[i].id;
      find = true;
      break;
    }
  }

  if(!find){
    fileSelected = null;
  }
}

function getElementBy(path){
  let element = document.getElementById("files-container");

  let i = 0;

  while(i < path.length && element != null){
    for(let child of element.children){
      if(child.id == path[i]){
        element = child;
        break;
      }
    }
    i++;
  }

  return element;
}

function hideContextMenu(e){
  contextMenu.classList.remove('open');
  contextMenu.classList.add('closed');
}

function fileChange(fileName){
  if(fileName != null){
    let image = document.getElementById(fileName + 'Image');

    image.src = '/assets/icone/modified.png';
  }
}

function save(){
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/saveFile', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send(JSON.stringify({
    name: fileSelected,
    content: editor.getValue(),
    path : pathFolder
  }));

  let image = document.getElementById(fileSelected + 'Image');
  image.src = '/assets/icone/valid-file.png';
}

function openFolder(folderName){
  let element = document.getElementById(folderName);
  
  for(let i = 0; i < element.children.length; i++){
    let child = element.children[i];

    if(child.classList.contains('open') && i != 0){
      child.classList.remove('open');
      child.classList.add('closed');
    }else{
      child.classList.remove('closed');
      child.classList.add('open');
    }
  }
}

function openFile(fileDom){

  if(oldFileDom != null){
    oldFileDom.classList.remove('active');
    if(oldFileDom.parent != null){
      oldFileDom.parentElement.classList.remove('active');
    }
  }
  
  oldFileDom = fileDom;
  fileSelected = fileDom.id;

  fileDom.classList.add('active');
  fileDom.parentElement.classList.add('active');

  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/getFile/' + fileSelected + '/' + JSON.stringify(pathFolder), true);
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      let fileContent = xhr.responseText;
      fileContent = JSON.parse(fileContent);

      editor.setValue(fileContent.content);
      fileSelected = fileContent.name;
    }
  }

  xhr.send();
}

/* ======================== context menu actions ======================*/

function addFile(){
  let newName = prompt('New name');

  if(newName != null){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/addFile', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        let response = xhr.responseText;
        response = JSON.parse(response);

        if(response.success){
          let folder = getElementBy(pathFolder);

          if(folder != null){
            folder.innerHTML += response.message;
          }
        }else{
          alert(response.message);
        }
      }
    }

    xhr.send(JSON.stringify({
      name: newName,
      content: '',
      path: pathFolder
    }));
  }
}

function addFolder(){
  let newName = prompt('New name');

  if(newName != null){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/addFolder', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        let response = xhr.responseText;
        response = JSON.parse(response);

        if(response.success){
          let folder = getElementBy(pathFolder);

          if(folder != null){
            addFolderView(folder, response.message);
          }
        }else{
          alert(response.message);
        }
      }
    }

    xhr.send(JSON.stringify({
      name: newName,
      path: pathFolder
    }));
  }
}

function addFolderView(folder, htmlFolder){
  let folderView = folder.children[0];

  let folderContent = new Array();
  for(let i = 0; i < folder.children.length; i++){
    if( i != 0){
      folderContent.push(folder.children[i]);
    }
  }

  folder.innerHTML = '';

  folder.appendChild(folderView);
  folder.innerHTML += htmlFolder;

  for(let element of folderContent){
    folder.appendChild(element);
  }
}

function remove(){
  let xhr = new XMLHttpRequest();
  xhr.open('DELETE', '/api/deleteFile', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      let response = xhr.responseText;
      response = JSON.parse(response);

      if(response.success){
        if(fileSelected != null){
          let file = getFile(pathFolder, fileSelected);
          file.remove();
        }else{
          let folder = getFolder(pathFolder);
          folder.remove();
        }
      }else{
        alert(response.message);
      }
    }
  }

  xhr.send(JSON.stringify({
    name: fileSelected,
    path: pathFolder
  }));
}

function rename(){
  let newName;

  if(fileSelected != null){
   newName = prompt('New name', fileSelected);
  }else{
    newName = prompt('New name', folderSelected);
  }

  if(newName != null){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/renameFile', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        let response = xhr.responseText;
        response = JSON.parse(response);

        if(response.success){
          if(fileSelected != null){
            let file = getFile(pathFolder, fileSelected);
            renameElement(pathFolder, fileSelected, newName);
          }else{
            let folder = getFolder(pathFolder);
            renameElement(pathFolder, fileSelected, newName);
          }
        }else{
          alert(response.message);
        }
      }
    }

    xhr.send(JSON.stringify({
      name: fileSelected,
      newName: newName,
      path: pathFolder
    }));
  }
}

/*===================== Codemirror init options ========================*/

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

editor.on("keydown", function(){
  fileChange(fileSelected);
});

editor.on('beforeChange',function(cm, change) {
  if (fileSelected == null) {
      change.cancel();
  }
});

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    save();
  }
});