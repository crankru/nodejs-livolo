var wpi = require('wiring-pi');

var livolo = {
	
	debugMode: false,
	pinNumber: null,
	repeats: 150, //
	p_short: 110, // 110 works quite OK
	p_long: 290, // 300 works quite OK
	p_start: 520, // 520 works quite OK
	high: true,
	
	open: function(pinNumber) {
		this.pinNumber = pinNumber;
		
		this.debugMsg('Pin: ' + this.pinNumber);
		
		wpi.setup('wpi');
		wpi.pinMode(this.pinNumber, wpi.OUTPUT);
	},
	
	// emulate key signal
	sendButton: function(remoteID, keycode) {
		this.debugMsg("sendButton: remoteID: " + remoteID + " keycode: " + keycode);
		
		// how many times to transmit a command
		for (pulse= 0; pulse <= this.repeats; pulse++) {
			
			this.sendPulse(1); // Start  
			this.high = true; // first pulse is always high

			// transmit remoteID
			for (i = 15; i >= 0; i--) { 
				var txPulse = remoteID & (1 << i);	// read bits from remote ID
				if (txPulse > 0) { 
					this.selectPulse(1); 
				} else {
					this.selectPulse(0);
				}
			}

			// XXX transmit keycode
			for (i = 6; i >= 0; i--)
			{
				var txPulse = keycode & (1 << i); 	// read bits from keycode
				if (txPulse > 0) {
					this.selectPulse(1); 
				} else {
					this.selectPulse(0);
				}
			} 
		}
  
		wpi.digitalWrite(this.pinNumber, wpi.LOW);
	},
	
	//
	selectPulse: function(inBit) {
		switch (inBit) {
			
			// if current pulse should be high, send High Zero
			case 0: 
				if (this.high == true) { 
					this.sendPulse(2); 
					this.sendPulse(4);
				} else {
					this.sendPulse(4); // else send Low Zero
					this.sendPulse(2);
				}
			break;

			// if current pulse should be high, send High One
			case 1: 
				if (this.high == true) {
					this.sendPulse(3);
				} else {
					this.sendPulse(5); // else send Low One
				}
				
				this.high =! this.high; // invert next pulse
			break; 
		}
	},
	
	// transmit pulse
	sendPulse: function(txPulse) {
		
		switch(txPulse) {
			case 0: // Start
				wpi.digitalWrite(this.pinNumber, wpi.LOW);
				wpi.delayMicroseconds(this.p_start); // 550
			break;
		   
			case 1: // Start
				wpi.digitalWrite(this.pinNumber, wpi.HIGH);
				wpi.delayMicroseconds(this.p_start); // 550
			break;

			case 2: // "High Zero"
				wpi.digitalWrite(this.pinNumber, wpi.LOW);
				wpi.delayMicroseconds(this.p_short); // 110
			break;
		 
			case 3: // "High One"
				wpi.digitalWrite(this.pinNumber, wpi.LOW);
				wpi.delayMicroseconds(this.p_long); // 303
			break; 

			case 4: // "Low Zero"
				wpi.digitalWrite(this.pinNumber, wpi.HIGH);
				wpi.delayMicroseconds(this.p_short); // 110
			break;

			case 5:	// "Low One"
				wpi.digitalWrite(this.pinNumber, wpi.HIGH);
				wpi.delayMicroseconds(this.p_long); // 290
			break; 
		}
	},
	
	debugMsg: function(msg) {
		if(this.debugMode == true) {
			console.log(msg);
		}
	}
}

module.exports = livolo;