function Superhero(name, canFly) {
    this.name = name;
    this.canFly = canFly;
}

Superhero.prototype.fly = function () {
    var msg = this.name + ': ';
    if (this.canFly) {
        msg += 'I am flying';
    } else {
        msg += "Sorry, I can't fly";
    }
    console.log(msg);
}

var superman = new Superhero('Klark Kent', true);
var cap = new Superhero('Captain America', false);

superman.fly();
cap.fly();
