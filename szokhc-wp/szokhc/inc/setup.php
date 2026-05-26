<?php
/**
 * Theme setup: supports, menus, image sizes.
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'after_setup_theme', function () {
	load_theme_textdomain( 'szokhc', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'script', 'style' ) );
	add_theme_support( 'custom-logo', array(
		'height'      => 88,
		'width'       => 360,
		'flex-height' => true,
		'flex-width'  => true,
	) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );

	register_nav_menus( array(
		'global'   => __( 'グローバルメニュー', 'szokhc' ),
		'utility'  => __( 'ヘッダー補助メニュー', 'szokhc' ),
		'footer'   => __( 'フッターメニュー', 'szokhc' ),
		'audience' => __( '対象者別ナビ（患者・病院・施設）', 'szokhc' ),
	) );

	add_image_size( 'szokhc-hero', 1920, 900, true );
	add_image_size( 'szokhc-card', 640, 420, true );
	add_image_size( 'szokhc-staff', 480, 600, true );
} );

add_action( 'widgets_init', function () {
	register_sidebar( array(
		'name'          => __( 'サイドバー', 'szokhc' ),
		'id'            => 'sidebar-1',
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3 class="widget__title">',
		'after_title'   => '</h3>',
	) );
	foreach ( array( 1, 2, 3 ) as $i ) {
		register_sidebar( array(
			'name'          => sprintf( __( 'フッター %d', 'szokhc' ), $i ),
			'id'            => 'footer-' . $i,
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h4 class="widget__title">',
			'after_title'   => '</h4>',
		) );
	}
} );
