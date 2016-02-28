# CMPUT404LAB8_W2016

Template Repository for CMPUT 404, Lab 8. Winter 2016.

## Getting Started

1. Ensure that `node` and `npm` are installed. Currently tested on 4.2.X but should work with any version of node.
2. Checkout this repository.
3. Run `npm install`
4. Start the application by running `./bin/www`

## Lab Instructions

1. We will be creating a very simple 'tug of war' application, where the bunny is in the middle and the client is controlled by clicking two butons on the left and the right of the screen.
2. Set the server sided rabbit to be in the middle of the screen.
```
// app.js
 console.log('Websocket server started on 8080');
 
-var rabbit = {x:0, y:0};
+// Set the rabbit to be the middle of the screen, at with 800/500 proportions
+var rabbit = {x:350, y:200};
```
3. Disable the draggable input on the rabbit.
```
// public/javascripts/game.js
function create() {
   this.client.openConnection();
   myText = game.add.text(0, 0, "started (not yet connected)", { font: "14px Arial", fill: "#ff0044"});
   sprite = game.add.sprite(0, 0, "rabbit");
-  sprite.inputEnabled = true;
-  sprite.input.enableDrag(false, true);
-  sprite.events.onDragStop.add(rabbitDragged, this);
+  //sprite.inputEnabled = true;
+  //sprite.input.enableDrag(false, true);
+  //sprite.events.onDragStop.add(rabbitDragged, this);
   game.stage.disableVisibilityChange = true;
 }
```
4. Set server to handle various states, left and right button clicks
```
// app.js 
 wss.on('connection', function(ws) {
   ws.on('message', function(message) {
-    var incommingMsg = JSON.parse(message);
-    rabbit.x = incommingMsg.x;
-    rabbit.y = incommingMsg.y;
-    for(var i in wss.clients) {
-      wss.clients[i].send(JSON.stringify(rabbit));
+    if (rabbit['state'] === 'game') {
+      var incommingMsg = JSON.parse(message);
+      if ('clicked' in incommingMsg) {
+        if (incommingMsg['clicked'] === 'left') {
+          rabbit.x -= 5;
+        } else if (incommingMsg['clicked'] === 'right') {
+          rabbit.x += 5;
+        }
+        if (rabbit.x < 100 || rabbit.x > 600) {
+          rabbit['state'] = 'gameOver'
+        } else {
+          rabbit['state'] = 'game';
+        }
+        for(var i in wss.clients) {
+          wss.clients[i].send(JSON.stringify(rabbit));
+        }
+      }
     }
   });
   ws.send(JSON.stringify(rabbit));
 });
```
5. Set the client to handle the various states
```
// public/javascripts/game.js
@@ -4,6 +4,8 @@ var sprite = null;
 
 function preload() {
   game.load.image("rabbit", "images/rabbit.png");
+  game.load.image("leftButton", "images/rabbit.png");
+  game.load.image("rightButton", "images/rabbit.png");
+  game.load.image("rightButton", "images/rabbit.png");
 }
 
 function create() {
@@ -11,15 +13,29 @@ function create() {
   this.client.openConnection();
   myText = game.add.text(0, 0, "started (not yet connected)", { font: "14px Arial", fill: "#ff0044"});
   sprite = game.add.sprite(0, 0, "rabbit");
-  sprite.inputEnabled = true;
-  sprite.input.enableDrag(false, true);
-  sprite.events.onDragStop.add(rabbitDragged, this);
+  //sprite.inputEnabled = true;
+  //sprite.input.enableDrag(false, true);
+  //sprite.events.onDragStop.add(rabbitDragged, this);
+  var leftButton = game.add.sprite(0, 200, "leftButton");
+  leftButton.inputEnabled = true;
+  leftButton.events.onInputDown.add(leftButtonClicked, this);
+
+  var rightButton = game.add.sprite(700, 200, "rightButton");
+  rightButton.inputEnabled = true;
+  rightButton.events.onInputDown.add(rightButtonClicked, this);
+
   game.stage.disableVisibilityChange = true;
 }
 
-function rabbitDragged() {
+function leftButtonClicked() {
   if (this.client.connected) {
-    this.client.ws.send(JSON.stringify({x: sprite.x, y: sprite.y}));
+    this.client.ws.send(JSON.stringify({clicked: 'left'}));
+  }
+}
+
+function rightButtonClicked() {
+  if (this.client.connected) {
+    this.client.ws.send(JSON.stringify({clicked: 'right'}));
   }
 }
 
@@ -43,8 +59,12 @@ Client.prototype.connectionOpen = function() {
 Client.prototype.onMessage = function(message) {
   myText.text = myText.text + message.data;
   var msg = JSON.parse(message.data);
-  sprite.x = msg.x;
-  sprite.y = msg.y;
+  if (msg.state === 'game') {
+    sprite.x = msg.x;
+    sprite.y = msg.y;
+  } else if (msg.state === 'gameOver') {
+    myText.text += '\nGameOver!'
+  }
 };
```

## LICENSE

The MIT License (MIT)

Copyright (c) 2016 Alexander Wong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
