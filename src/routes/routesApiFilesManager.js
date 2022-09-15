const express = require('express');
let router = express.Router();

var db = require('../dbAccess/dbAccess');
var utils = require('../utils/utils');

router.post('/saveFile', (req, res) => {
  let fileName = req.body.name;
  let fileContent = req.body.content;
  let id = req.session.id;
  let path = req.body.path;

  let file = {
    name : fileName,
    content : fileContent,
    id : id
  };

  db.saveFile(file, path, id, (success) => {
    if(success){
      res.send(utils.createErrorRequest(true));
    }else{
      res.send(utils.createErrorRequest(false, "Error while saving file"));
    }
  });

  db.setMainAI(file, path, id, (success) => {
    if(success){
      res.send(utils.createErrorRequest(true));
    }else{
      res.send(utils.createErrorRequest(false, "Error while putting file in main AI"));
    }
  });

});

router.post('/addFile', (req, res) => {
  let fileName = req.body.name;
  let fileContent = req.body.content;
  let id = req.session.id;
  let path = req.body.path;

  let file = {
    name : fileName,
    content : fileContent,
    type : "file"
  };

  db.addFile(file, path, id, (success) => {
    if(success){
      let content = new Array();
      let deep = path != undefined ? path.length * 5 : 0;
      content.push(file);

      res.render("partials/editCode/fileView", {
        items: content,
        deep: deep,
      }, (err, html) => {
        res.send(utils.createErrorRequest(true, html));
      });

    }else{
      res.send(utils.createErrorRequest(false, "File name already exist"));
    }
  });
});

router.post('/addFolder', (req, res) => {
  let folderName = req.body.name;
  let id = req.session.id;
  let path = req.body.path;

  let folder = {
    name : folderName,
    type : "folder",
    content : new Array()
  };

  db.addFolder(folder, path, id, (success) => {
    if(success){
      let content = new Array();
      let deep = path != undefined ? path.length * 5 : 0;
      content.push(folder);

      res.render("partials/editCode/fileView", {
        items: content,
        deep: deep,
      }, (err, html) => {
        res.send(utils.createErrorRequest(true, html));
      } );
    }else{
      res.send(utils.createErrorRequest(false, "Folder name already exist"));
    }
  } );
});

router.delete('/deleteFile', (req, res) => {
  let id = req.session.id;
  let path = req.body.path;
  let fileName = req.body.name;

  if(fileName == null){
    db.deleteFolder(path, id, (success) => {
      if(success){
        res.send(utils.createErrorRequest(true));
      }else{
        res.send(utils.createErrorRequest(false, "Error while deleting folder"));
      }
    });
  }else{
    db.deleteFile(path, fileName, id, (success) => {
      if(success){
        res.send(utils.createErrorRequest(true));
      }else{
        res.send(utils.createErrorRequest(false, "Error while deleting file"));
      }
    });

    db.deleteMainAI(fileName, path, id);
  }
});


router.post('/renameFile', (req, res) => {
  let id = req.session.id;
  let path = req.body.path;
  let fileName = req.body.name;
  let newName = req.body.newName;

  db.renameFile(path, fileName, newName, id, (success) => {
    if(success){
      res.send(utils.createErrorRequest(true));
    }else{
      res.send(utils.createErrorRequest(false, "Error while renaming file"));
    }
  });
});

router.get('/getFile/:fileName/:path', async (req, res) => {
  let fileName = req.params.fileName;
  let path = JSON.parse(req.params.path);
  let id = req.session.id;
  
  let file = await db.getFile(fileName, path, id);
  
  res.send(file);
});

module.exports = router;