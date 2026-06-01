<?php
/**
 * Custom post types and taxonomies.
 *
 * トップページに並ぶ動的コンテンツをコンテンツタイプ単位で分離。
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'init', function () {

	register_post_type( 'szk_column', array(
		'label'        => __( '在宅医療の教科書', 'szokhc' ),
		'public'       => true,
		'show_in_rest' => true,
		'menu_icon'    => 'dashicons-book',
		'has_archive'  => 'column',
		'rewrite'      => array( 'slug' => 'column', 'with_front' => false ),
		'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
	) );

	register_post_type( 'szk_conference', array(
		'label'        => __( '講演会情報', 'szokhc' ),
		'public'       => true,
		'show_in_rest' => true,
		'menu_icon'    => 'dashicons-megaphone',
		'has_archive'  => 'conference',
		'rewrite'      => array( 'slug' => 'conference', 'with_front' => false ),
		'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
	) );

	register_post_type( 'szk_media_news', array(
		'label'        => __( 'メディア掲載', 'szokhc' ),
		'public'       => true,
		'show_in_rest' => true,
		'menu_icon'    => 'dashicons-format-video',
		'has_archive'  => 'media-news',
		'rewrite'      => array( 'slug' => 'media-news', 'with_front' => false ),
		'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
	) );

	register_post_type( 'szk_staff', array(
		'label'        => __( '医師・スタッフ', 'szokhc' ),
		'public'       => true,
		'show_in_rest' => true,
		'menu_icon'    => 'dashicons-businessperson',
		'has_archive'  => false,
		'rewrite'      => array( 'slug' => 'staff', 'with_front' => false ),
		'supports'     => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
	) );

	register_post_type( 'szk_service', array(
		'label'        => __( '診療メニュー', 'szokhc' ),
		'public'       => true,
		'show_in_rest' => true,
		'menu_icon'    => 'dashicons-heart',
		'has_archive'  => false,
		'rewrite'      => array( 'slug' => 'service', 'with_front' => false ),
		'supports'     => array( 'title', 'editor', 'thumbnail', 'page-attributes', 'excerpt' ),
	) );

	register_post_type( 'szk_facility', array(
		'label'        => __( '施設・拠点', 'szokhc' ),
		'public'       => true,
		'show_in_rest' => true,
		'menu_icon'    => 'dashicons-building',
		'has_archive'  => false,
		'rewrite'      => array( 'slug' => 'facility', 'with_front' => false ),
		'supports'     => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
	) );

	register_taxonomy( 'szk_news_category', array( 'post' ), array(
		'label'        => __( 'お知らせカテゴリ', 'szokhc' ),
		'public'       => true,
		'hierarchical' => true,
		'show_in_rest' => true,
		'rewrite'      => array( 'slug' => 'news-category' ),
	) );

	register_taxonomy( 'szk_audience', array( 'post', 'szk_service' ), array(
		'label'        => __( '対象（患者／病院／施設）', 'szokhc' ),
		'public'       => true,
		'hierarchical' => true,
		'show_in_rest' => true,
		'rewrite'      => array( 'slug' => 'audience' ),
	) );

} );
