/*
delet - Powerful. Configurable. Multipurpose.
© DS Development Group & Contributors 2017 - 2018
Contributors are listed in package.json

Licensed under the GPL-3.0 license.

https://delet.js.org/
*/

console.log(`%c
Hey! Want to view this site's full source code?
Check it out here: https://github.com/DS-Development/delet/tree/master/docs.

Want to join the DS Development Group?
Head to https://delet.js.org/go/join.`,
"color: #00e0e0");

// Make sure service workers are supported
if ("serviceWorker" in navigator) {
	console.log("[SW] Service worker supported.");
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("../../sw.js")
			.then(reg => console.log("[SW] Service worker registered.")) // eslint-disable-line no-unused-vars
			.catch(err => console.error(`[SW] Error: ${err}`));
	});
}

// TODO: implement check (to see if JS is enabled)

// TypeWriter
class TypeWriter {
	constructor(txtElement, words, wait = 3000) {
		this.txtElement = txtElement;
		this.words = words;
		this.txt = "";
		this.wordIndex = 0;
		this.wait = parseInt(wait, 10);
		this.type();
		this.isDeleting = false;
	}
	
	type() {
		const index = this.wordIndex % this.words.length;
		const fullTxt = this.words[index];

		if (this.isDeleting) {
			// Remove char
			this.txt = fullTxt.substring(0, this.txt.length - 1);
		} else {
			// Add char
			this.txt = fullTxt.substring(0, this.txt.length + 1);
		}

		this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;
		let typeSpeed = 150;

		if (this.isDeleting) {
			typeSpeed /= 2;
		}

		if (!this.isDeleting && this.txt === fullTxt) {
			typeSpeed = this.wait;
			this.isDeleting = true;
		} else if (this.isDeleting && this.txt === "") {
			this.isDeleting = false;
			this.wordIndex++;
			typeSpeed = 300;
		}

		setTimeout(() => this.type(), typeSpeed);
	}
}

const init = () => {
	const txtElement = document.querySelector(".txt-type");
	const words = JSON.parse(txtElement.getAttribute("data-words"));
	const wait = txtElement.getAttribute("data-wait");

	new TypeWriter(txtElement, words, wait);
};

document.addEventListener("DOMContentLoaded", init());

// Main jQuery
(function($) {

	skel.breakpoints({
		xlarge:	"(max-width: 1680px)",
		large:	"(max-width: 1280px)",
		medium:	"(max-width: 980px)",
		small:	"(max-width: 736px)",
		xsmall:	"(max-width: 480px)"
	});

	$(function() {

		var	$window = $(window),
			$body = $("body"),
			$sidebar = $("#sidebar");

		// Hack: Enable IE flexbox workarounds.
			if (skel.vars.IEVersion < 12)
				$body.addClass("is-ie");

		// Disable animations/transitions until the page has loaded.
			if (skel.canUse("transition"))
				$body.addClass("is-loading");

			$window.on("load", function() {
				window.setTimeout(function() {
					$body.removeClass("is-loading");
				}, 100);
			});

		// Forms.

			// Fix: Placeholder polyfill.
				$("form").placeholder();

			// Hack: Activate non-input submits.
				$("form").on("click", ".submit", function(event) {

					// Stop propagation, default.
						event.stopPropagation();
						event.preventDefault();

					// Submit form.
						$(this).parents("form").submit();

				});

		// Prioritize "important" elements on medium.
			skel.on("+medium -medium", function() {
				$.prioritize(
					".important\\28 medium\\29",
					skel.breakpoint("medium").active
				);
			});

		// Sidebar.
			if ($sidebar.length > 0) {

				var $sidebar_a = $sidebar.find("a");

				$sidebar_a
					.addClass("scrolly")
					.on("click", function() {

						var $this = $(this);

						// External link? Bail.
							if ($this.attr("href").charAt(0) != "#")
								return;

						// Deactivate all links.
							$sidebar_a.removeClass("active");

						// Activate link *and* lock it (so Scrollex doesn"t try to activate other links as we"re scrolling to this one"s section).
							$this
								.addClass("active")
								.addClass("active-locked");

					})
					.each(function() {

						var	$this = $(this),
							id = $this.attr("href"),
							$section = $(id);

						// No section for this link? Bail.
							if ($section.length < 1)
								return;

						// Scrollex.
							$section.scrollex({
								mode: "middle",
								top: "-20vh",
								bottom: "-20vh",
								initialize: function() {

									// Deactivate section.
										if (skel.canUse("transition"))
											$section.addClass("inactive");

								},
								enter: function() {

									// Activate section.
										$section.removeClass("inactive");

									// No locked links? Deactivate all links and activate this section"s one.
										if ($sidebar_a.filter(".active-locked").length == 0) {

											$sidebar_a.removeClass("active");
											$this.addClass("active");

										}

									// Otherwise, if this section"s link is the one that"s locked, unlock it.
										else if ($this.hasClass("active-locked"))
											$this.removeClass("active-locked");

								}
							});

					});

			}

		// Scrolly.
			$(".scrolly").scrolly({
				speed: 1000,
				offset: function() {

					// If <=large, >small, and sidebar is present, use its height as the offset.
						if (skel.breakpoint("large").active
						&&	!skel.breakpoint("small").active
						&&	$sidebar.length > 0)
							return $sidebar.height();

					return 0;

				}
			});

		// Spotlights.
			$(".spotlights > section")
				.scrollex({
					mode: "middle",
					top: "-10vh",
					bottom: "-10vh",
					initialize: function() {

						// Deactivate section.
							if (skel.canUse("transition"))
								$(this).addClass("inactive");

					},
					enter: function() {

						// Activate section.
							$(this).removeClass("inactive");

					}
				})
				.each(function() {

					var	$this = $(this),
						$image = $this.find(".image"),
						$img = $image.find("img"),
						x;

					// Assign image.
						$image.css("background-image", "url(" + $img.attr("src") + ")");

					// Set background position.
						if (x = $img.data("position")) // eslint-disable-line no-cond-assign
							$image.css("background-position", x);

					// Hide <img>.
						$img.hide();

				});

		// Features.
			if (skel.canUse("transition"))
				$(".features")
					.scrollex({
						mode: "middle",
						top: "-20vh",
						bottom: "-20vh",
						initialize: function() {

							// Deactivate section.
								$(this).addClass("inactive");

						},
						enter: function() {

							// Activate section.
								$(this).removeClass("inactive");

						}
					});

	});

})(jQuery);