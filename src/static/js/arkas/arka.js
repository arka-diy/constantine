class Arka {

	// type = "loop";
	animations = {};

	// setType(type) {
	// 	this.type = type;
	// }

	setAnimation(id, animation) {
		this.animations[id] = animation;
	}

	getAnimation(id) {
		return this.animations[id];
	}

	preview() {
		return [].concat.apply([], Object.values(this.animations).map(a => a()));
	}

}