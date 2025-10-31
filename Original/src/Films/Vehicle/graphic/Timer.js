/* eslint-disable no-empty-function */

class Timer {
	constructor() {
		this.mainPrev = window.performance.now();
		this.pulseHerz = {
			_1_: {
				pulse: false,
				prev: this.mainPrev
			},
			_2_: {
				pulse: false,
				prev: this.mainPrev
			}
		};
	}

	preStart() {
		this.mainPrev = window.performance.now();
		this.pulseHerz._1_.prev = this.mainPrev;
		this.pulseHerz._2_.prev = this.mainPrev;
	}

	update() {
		this.checkHerz( 500, this.pulseHerz._2_ );
		this.checkHerz( 1000, this.pulseHerz._1_ );
	}

	checkHerz( time = 100, herz ) {
		if ( ( window.performance.now() - herz.prev ) >= time ) {
			herz.prev = window.performance.now();
			herz.pulse = true;
		} else {
			herz.pulse = false;
		}
	}

	postStart() {
		this.pulseHerz._1_.pulse = false;
		this.pulseHerz._2_.pulse = false;
	}

	stop() {

	}


}

export { Timer };
