<?php
/**
 * Asset enqueue.
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'wp_enqueue_scripts', function () {
	$ver = SZOKHC_THEME_VERSION;
	wp_enqueue_style(
		'szokhc-style',
		get_stylesheet_uri(),
		array(),
		$ver
	);
	if ( file_exists( get_template_directory() . '/assets/css/app.css' ) ) {
		wp_enqueue_style(
			'szokhc-app',
			get_template_directory_uri() . '/assets/css/app.css',
			array( 'szokhc-style' ),
			$ver
		);
	}
	if ( file_exists( get_template_directory() . '/assets/js/app.js' ) ) {
		wp_enqueue_script(
			'szokhc-app',
			get_template_directory_uri() . '/assets/js/app.js',
			array(),
			$ver,
			true
		);
	}
} );

add_action( 'enqueue_block_editor_assets', function () {
	if ( file_exists( get_template_directory() . '/assets/css/editor.css' ) ) {
		wp_enqueue_style(
			'szokhc-editor',
			get_template_directory_uri() . '/assets/css/editor.css',
			array(),
			SZOKHC_THEME_VERSION
		);
	}
} );
