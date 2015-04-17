function Superhero(name, canFly) {
    'use strict'
    this.name = name;
    this.canFly = canFly;
}

Superhero.prototype.fly = function () {
    'use strict'
    var msg = this.name + ': ';
    if (this.canFly) {
        msg += 'I am flying';
    } else {
        msg += "Sorry, I can't fly";
    }
    console.log(msg);
}

module.exports = Superhero;

