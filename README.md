# nodejs-livolo
Nodejs library for livolo switches.

I use it for Blynk lybrary.

Depending on wiring-pi library (http://wiringpi.com)
```
npm install wiring-pi
```

## Example
```
var Livolo = require('livolo.js');

//Livolo.debugMode = true;
Livolo.repeats = 150; // It depends on the transmitter power and the distance 
Livolo.open(1); // transmitter pin number
Livolo.sendButton(6400, 120);
```

## Signal and key codes

sendButton function uses to arguments: remote ID and keycode. Typically, remote IDs are 16 bit unsigned values, but
not all of them are valid (maybe there are some IDs reserved only for system use or there is something I don't know).

Tested remote IDs: 

- read from real remote IDs: 6400; 19303
- "virtual" remote IDs: 10550; 8500; 7400

You can try and find new IDs as well: put your switch into learning mode and start sendButton with remote ID you wish to use. If
it is a valid ID, switch will accept it.

Keycodes read from real remote:
```
#1: 0, #2: 96, #3: 120, #4: 24, #5: 80, #6: 48, #7: 108, #8: 12, #9: 72; #10: 40, #OFF: 106
```
Keycodes are 7 bit values (actually I use 8 bit values, just skip most significant (leftmost) bit), but other keycodes
