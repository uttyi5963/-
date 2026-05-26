<?php
/**
 * Reusable template helpers.
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! function_exists( 'szokhc_mod' ) ) {
	function szokhc_mod( $key, $default = '' ) {
		$val = get_theme_mod( $key, $default );
		return $val === '' ? $default : $val;
	}
}

if ( ! function_exists( 'szokhc_tel_link' ) ) {
	function szokhc_tel_link() {
		$tel = szokhc_mod( 'szokhc_tel' );
		if ( ! $tel ) { return ''; }
		$href = preg_replace( '/[^0-9+]/', '', $tel );
		return sprintf(
			'<a class="site-header__tel" href="tel:%s">%s</a>',
			esc_attr( $href ),
			esc_html( $tel )
		);
	}
}

if ( ! function_exists( 'szokhc_news_query' ) ) {
	function szokhc_news_query( $limit = 5 ) {
		return new WP_Query( array(
			'post_type'      => 'post',
			'posts_per_page' => absint( $limit ),
			'no_found_rows'  => true,
		) );
	}
}

if ( ! function_exists( 'szokhc_format_date' ) ) {
	function szokhc_format_date( $post_id = null ) {
		return get_the_date( 'Y.m.d', $post_id );
	}
}

if ( ! function_exists( 'szokhc_primary_category' ) ) {
	function szokhc_primary_category( $post_id = null ) {
		$terms = get_the_terms( $post_id, 'szk_news_category' );
		if ( empty( $terms ) || is_wp_error( $terms ) ) {
			$terms = get_the_category( $post_id );
		}
		if ( empty( $terms ) ) { return ''; }
		$term = is_array( $terms ) ? reset( $terms ) : $terms;
		return $term ? $term->name : '';
	}
}
