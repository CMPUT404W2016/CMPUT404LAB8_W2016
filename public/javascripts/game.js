var game = new Phaser.Game(800, 500, Phaser.AUTO, 'phaser', { preload: preload, create: create});
var myText = null;
var sprite = null;

function preload() {
  game.load.image("rabbit", "images/rabbit.png");
}

function create() {
  this.client = new Client();
  this.client.openConnection();
  myText = game.add.text(0, 0, "started (not yet connected)", { font: "14px Arial", fill: "#ff0044"});
  sprite = game.add.sprite(0, 0, "rabbit");
  sprite.inputEnabled = true;
  sprite.input.enableDrag(false, true);
  sprite.events.onDragStop.add(rabbitDragged, this);
  game.stage.disableVisibilityChange = true;
}

function rabbitDragged() {
  if (this.client.connected) {
    this.client.ws.send(JSON.stringify({x: sprite.x, y: sprite.y}));
  }
}

function Client() {

}

Client.prototype.openConnection = function() {
  this.ws = new WebSocket("ws://127.0.0.1:8080");
  this.connected = false;
  this.ws.onmessage = this.onMessage.bind(this);
  this.ws.onerror = this.displayError.bind(this);
  this.ws.onopen = this.connectionOpen.bind(this);
};

Client.prototype.connectionOpen = function() {
  this.connected = true;
  myText.text = 'connected\n';
};

Client.prototype.onMessage = function(message) {
  myText.text = myText.text + message.data;
  var msg = JSON.parse(message.data);
  sprite.x = msg.x;
  sprite.y = msg.y;
};

Client.prototype.displayError = function(err) {
  console.log('Websocketerror: ' + err);
};