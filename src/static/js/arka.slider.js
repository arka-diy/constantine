// Internal

function initSlider() {
	context.slider.slides = context.UI.sliderView.children;

	for (var i = 0; i < context.slider.slides.length; i++) {
		context.slider.slides[i].style.width = document.body.clientWidth + "px";

		var arka = document.createElement("div");
		arka.classList.add("arka");

		var screen = document.createElement("div");
		screen.classList.add("screen");

		arka.appendChild(screen);

		context.slider.slides[i].appendChild(arka);
	}

	context.UI.sliderView.style.width = document.body.clientWidth * context.slider.slides.length + "px";

	window.addEventListener("scroll", handleSlider);
}

function handleSlider() {
	if(context.slider.timer) clearTimeout(context.slider.timer);
	context.slider.timer = setTimeout(stickSlider, 100);
}

function stickSlider() {
	var width = document.body.clientWidth;
	var stickedPosition = parseInt((window.scrollX + width / 2) / width, 10) * width;

	context.slider.slides[context.slider.index].classList.remove("active");
	context.slider.index = parseInt(stickedPosition / width, 10);
	context.slider.slides[context.slider.index].classList.add("active");

	screenLoad();
	
	window.scrollTo({
		top: 0,
		left: stickedPosition,
		behavior: "smooth"
	});
}