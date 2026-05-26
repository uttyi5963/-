<?php
/**
 * Customizer settings.
 *
 * クリニック名・電話番号・住所・営業時間など、ハードコードしたく
 * ない運用情報を管理画面から編集できるようにする。
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'customize_register', function ( $wp_customize ) {

	$wp_customize->add_section( 'szokhc_contact', array(
		'title'    => __( 'クリニック連絡先', 'szokhc' ),
		'priority' => 30,
	) );

	$controls = array(
		'szokhc_org_name'      => array( 'label' => __( '法人名', 'szokhc' ),       'default' => '' ),
		'szokhc_clinic_name'   => array( 'label' => __( 'クリニック名', 'szokhc' ), 'default' => '' ),
		'szokhc_tel'           => array( 'label' => __( '代表電話番号', 'szokhc' ), 'default' => '' ),
		'szokhc_fax'           => array( 'label' => __( 'FAX', 'szokhc' ),          'default' => '' ),
		'szokhc_address'       => array( 'label' => __( '住所', 'szokhc' ),         'default' => '' ),
		'szokhc_hours'         => array( 'label' => __( '受付時間', 'szokhc' ),     'default' => '' ),
		'szokhc_hours_note'    => array( 'label' => __( '休診案内など補足', 'szokhc' ), 'default' => '' ),
		'szokhc_email'         => array( 'label' => __( '問い合わせメール', 'szokhc' ), 'default' => '' ),
	);

	foreach ( $controls as $id => $cfg ) {
		$wp_customize->add_setting( $id, array(
			'default'           => $cfg['default'],
			'sanitize_callback' => 'sanitize_text_field',
			'transport'         => 'refresh',
		) );
		$wp_customize->add_control( $id, array(
			'label'   => $cfg['label'],
			'section' => 'szokhc_contact',
			'type'    => 'text',
		) );
	}

	$wp_customize->add_section( 'szokhc_hero', array(
		'title'    => __( 'トップ ヒーロー領域', 'szokhc' ),
		'priority' => 40,
	) );

	$hero = array(
		'szokhc_hero_title' => __( 'ヒーロー見出し', 'szokhc' ),
		'szokhc_hero_lead'  => __( 'ヒーロー リード文', 'szokhc' ),
		'szokhc_hero_cta1'  => __( 'CTA1 ラベル', 'szokhc' ),
		'szokhc_hero_cta1_url' => __( 'CTA1 URL', 'szokhc' ),
		'szokhc_hero_cta2'  => __( 'CTA2 ラベル', 'szokhc' ),
		'szokhc_hero_cta2_url' => __( 'CTA2 URL', 'szokhc' ),
	);
	foreach ( $hero as $id => $label ) {
		$wp_customize->add_setting( $id, array(
			'default'           => '',
			'sanitize_callback' => 'wp_kses_post',
			'transport'         => 'refresh',
		) );
		$wp_customize->add_control( $id, array(
			'label'   => $label,
			'section' => 'szokhc_hero',
			'type'    => 'text',
		) );
	}

	$wp_customize->add_setting( 'szokhc_hero_image', array(
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'szokhc_hero_image', array(
		'label'   => __( 'ヒーロー背景画像', 'szokhc' ),
		'section' => 'szokhc_hero',
	) ) );

} );
