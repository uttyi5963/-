/**
 * Theme front-end JS.
 *
 * - Main visual slider (vanilla, jQuery不要)
 * - SP メニュー開閉
 *
 * @package Szokhc
 */

(function () {
	'use strict';

	function initSlider(root) {
		var list = root.querySelector('.mainvisual__list');
		if (!list) { return; }
		var items = list.querySelectorAll('li');
		if (items.length < 2) { return; }

		root.classList.add('is-ready');
		var idx = 0;
		var interval = parseInt(root.getAttribute('data-interval'), 10) || 6000;

		setInterval(function () {
			items[idx].classList.remove('is-active');
			idx = (idx + 1) % items.length;
			items[idx].classList.add('is-active');
		}, interval);
	}

	function initMenu() {
		var btn = document.querySelector('.menu-btn');
		var nav = document.getElementById('gnavi');
		if (!btn || !nav) { return; }
		btn.addEventListener('click', function () {
			var open = nav.classList.toggle('is-open');
			btn.setAttribute('aria-expanded', open ? 'true' : 'false');
		});
	}

	document.addEventListener('DOMContentLoaded', function () {
		document.querySelectorAll('[data-szokhc-slider]').forEach(initSlider);
		initMenu();
	});
})();
