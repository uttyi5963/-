<?php
/**
 * Customizer settings.
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'customize_register', function ( $wp_customize ) {

	/* ----- クリニック連絡先 ----- */
	$wp_customize->add_section( 'szokhc_contact', array(
		'title'    => __( 'クリニック連絡先', 'szokhc' ),
		'priority' => 30,
	) );

	$contact = array(
		'szokhc_org_name'    => __( '法人名', 'szokhc' ),
		'szokhc_clinic_name' => __( 'クリニック名', 'szokhc' ),
		'szokhc_postal'      => __( '郵便番号', 'szokhc' ),
		'szokhc_address'     => __( '住所', 'szokhc' ),
		'szokhc_tel'         => __( '代表電話番号', 'szokhc' ),
		'szokhc_fax'         => __( 'FAX', 'szokhc' ),
		'szokhc_email'       => __( '問い合わせメール', 'szokhc' ),
	);
	foreach ( $contact as $id => $label ) {
		$wp_customize->add_setting( $id, array(
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
		) );
		$wp_customize->add_control( $id, array(
			'label'   => $label,
			'section' => 'szokhc_contact',
			'type'    => 'text',
		) );
	}

	/* ----- メインビジュアル（スライダー） ----- */
	$wp_customize->add_section( 'szokhc_mainvisual', array(
		'title'    => __( 'メインビジュアル', 'szokhc' ),
		'priority' => 35,
	) );
	for ( $i = 1; $i <= 5; $i++ ) {
		$wp_customize->add_setting( "szokhc_mv_image_{$i}", array(
			'sanitize_callback' => 'esc_url_raw',
		) );
		$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, "szokhc_mv_image_{$i}", array(
			'label'   => sprintf( __( 'スライド %d 画像', 'szokhc' ), $i ),
			'section' => 'szokhc_mainvisual',
		) ) );
		$wp_customize->add_setting( "szokhc_mv_url_{$i}", array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		) );
		$wp_customize->add_control( "szokhc_mv_url_{$i}", array(
			'label'   => sprintf( __( 'スライド %d リンク先 (任意)', 'szokhc' ), $i ),
			'section' => 'szokhc_mainvisual',
			'type'    => 'url',
		) );
	}

	/* ----- トップ：理念リード ----- */
	$wp_customize->add_section( 'szokhc_intro', array(
		'title'    => __( 'トップ：理念リード', 'szokhc' ),
		'priority' => 40,
	) );
	$wp_customize->add_setting( 'szokhc_intro_title', array(
		'default'           => '',
		'sanitize_callback' => 'wp_kses_post',
	) );
	$wp_customize->add_control( 'szokhc_intro_title', array(
		'label'       => __( '見出し（緑色・太字）', 'szokhc' ),
		'section'     => 'szokhc_intro',
		'type'        => 'textarea',
	) );
	$wp_customize->add_setting( 'szokhc_intro_body', array(
		'default'           => '',
		'sanitize_callback' => 'wp_kses_post',
	) );
	$wp_customize->add_control( 'szokhc_intro_body', array(
		'label'       => __( '本文', 'szokhc' ),
		'section'     => 'szokhc_intro',
		'type'        => 'textarea',
	) );
	$wp_customize->add_setting( 'szokhc_intro_image_left', array( 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'szokhc_intro_image_left', array(
		'label'   => __( '理念リード 左画像', 'szokhc' ),
		'section' => 'szokhc_intro',
	) ) );
	$wp_customize->add_setting( 'szokhc_intro_image_right', array( 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'szokhc_intro_image_right', array(
		'label'   => __( '理念リード 右画像', 'szokhc' ),
		'section' => 'szokhc_intro',
	) ) );
	$wp_customize->add_setting( 'szokhc_intro_image_right_url', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'szokhc_intro_image_right_url', array(
		'label'   => __( '右画像リンク先 (任意)', 'szokhc' ),
		'section' => 'szokhc_intro',
		'type'    => 'url',
	) );
	$wp_customize->add_setting( 'szokhc_intro_below_image', array( 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'szokhc_intro_below_image', array(
		'label'   => __( '下部 横長画像', 'szokhc' ),
		'section' => 'szokhc_intro',
	) ) );

	/* ----- 診療時間 ----- */
	$wp_customize->add_section( 'szokhc_hours', array(
		'title'    => __( 'トップ：診療時間', 'szokhc' ),
		'priority' => 45,
	) );
	$wp_customize->add_setting( 'szokhc_hours_outpatient_label', array(
		'default'           => '8:45 – 10:00',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'szokhc_hours_outpatient_label', array(
		'label'   => __( '外来診療時間帯（左セル）', 'szokhc' ),
		'section' => 'szokhc_hours',
		'type'    => 'text',
	) );
	$wp_customize->add_setting( 'szokhc_hours_pattern', array(
		'default'           => '○,○,○,○,○,-,-',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'szokhc_hours_pattern', array(
		'label'       => __( '曜日パターン（月,火,水,木,金,土,日 をカンマ区切り）', 'szokhc' ),
		'description' => __( '例: ○,○,○,○,○,-,-', 'szokhc' ),
		'section'     => 'szokhc_hours',
		'type'        => 'text',
	) );
	$wp_customize->add_setting( 'szokhc_hours_closed', array(
		'default'           => '土・日・祝日',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'szokhc_hours_closed', array(
		'label'   => __( '休診日', 'szokhc' ),
		'section' => 'szokhc_hours',
		'type'    => 'text',
	) );
	$wp_customize->add_setting( 'szokhc_homecare_note', array(
		'default'           => '',
		'sanitize_callback' => 'wp_kses_post',
	) );
	$wp_customize->add_control( 'szokhc_homecare_note', array(
		'label'   => __( '在宅診療 案内文', 'szokhc' ),
		'section' => 'szokhc_hours',
		'type'    => 'textarea',
	) );
	$wp_customize->add_setting( 'szokhc_homecare_link', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'szokhc_homecare_link', array(
		'label'   => __( '在宅診療 詳細リンク', 'szokhc' ),
		'section' => 'szokhc_hours',
		'type'    => 'url',
	) );

	/* ----- 診療のかたち ----- */
	$wp_customize->add_section( 'szokhc_carestyles', array(
		'title'    => __( 'トップ：診療のかたち', 'szokhc' ),
		'priority' => 50,
	) );
	$wp_customize->add_setting( 'szokhc_carestyles_lead', array(
		'default'           => '',
		'sanitize_callback' => 'wp_kses_post',
	) );
	$wp_customize->add_control( 'szokhc_carestyles_lead', array(
		'label'   => __( 'リード文', 'szokhc' ),
		'section' => 'szokhc_carestyles',
		'type'    => 'textarea',
	) );
	for ( $i = 1; $i <= 4; $i++ ) {
		$wp_customize->add_setting( "szokhc_carestyle_image_{$i}", array( 'sanitize_callback' => 'esc_url_raw' ) );
		$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, "szokhc_carestyle_image_{$i}", array(
			'label'   => sprintf( __( 'カード %d 画像', 'szokhc' ), $i ),
			'section' => 'szokhc_carestyles',
		) ) );
		$wp_customize->add_setting( "szokhc_carestyle_url_{$i}", array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		) );
		$wp_customize->add_control( "szokhc_carestyle_url_{$i}", array(
			'label'   => sprintf( __( 'カード %d リンク先', 'szokhc' ), $i ),
			'section' => 'szokhc_carestyles',
			'type'    => 'url',
		) );
	}

	/* ----- 症状訴求（リウマチ・膠原病） ----- */
	$wp_customize->add_section( 'szokhc_symptoms', array(
		'title'    => __( 'トップ：症状訴求', 'szokhc' ),
		'priority' => 55,
	) );
	$wp_customize->add_setting( 'szokhc_symptoms_heading', array(
		'default'           => '',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'szokhc_symptoms_heading', array(
		'label'   => __( '見出し', 'szokhc' ),
		'section' => 'szokhc_symptoms',
		'type'    => 'text',
	) );
	$wp_customize->add_setting( 'szokhc_symptoms_image', array( 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'szokhc_symptoms_image', array(
		'label'   => __( '左画像', 'szokhc' ),
		'section' => 'szokhc_symptoms',
	) ) );
	$wp_customize->add_setting( 'szokhc_symptoms_body', array(
		'default'           => '',
		'sanitize_callback' => 'wp_kses_post',
	) );
	$wp_customize->add_control( 'szokhc_symptoms_body', array(
		'label'   => __( '本文', 'szokhc' ),
		'section' => 'szokhc_symptoms',
		'type'    => 'textarea',
	) );
	$wp_customize->add_setting( 'szokhc_symptoms_link_image', array( 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'szokhc_symptoms_link_image', array(
		'label'   => __( '詳細リンク画像', 'szokhc' ),
		'section' => 'szokhc_symptoms',
	) ) );
	$wp_customize->add_setting( 'szokhc_symptoms_link_url', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'szokhc_symptoms_link_url', array(
		'label'   => __( '詳細リンク URL', 'szokhc' ),
		'section' => 'szokhc_symptoms',
		'type'    => 'url',
	) );
	$wp_customize->add_setting( 'szokhc_symptoms_below_image', array( 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'szokhc_symptoms_below_image', array(
		'label'   => __( '症状訴求 下部 横長画像', 'szokhc' ),
		'section' => 'szokhc_symptoms',
	) ) );

	/* ----- 3カラム情報グリッド ----- */
	$wp_customize->add_section( 'szokhc_infogrid', array(
		'title'    => __( 'トップ：3カラムバナー', 'szokhc' ),
		'priority' => 60,
	) );
	$labels = array( 'メディア掲載', '講演会情報', 'ブログ' );
	for ( $i = 1; $i <= 3; $i++ ) {
		$wp_customize->add_setting( "szokhc_info_image_{$i}", array( 'sanitize_callback' => 'esc_url_raw' ) );
		$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, "szokhc_info_image_{$i}", array(
			'label'   => sprintf( __( 'バナー %d 画像 (%s)', 'szokhc' ), $i, $labels[ $i - 1 ] ),
			'section' => 'szokhc_infogrid',
		) ) );
		$wp_customize->add_setting( "szokhc_info_url_{$i}", array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		) );
		$wp_customize->add_control( "szokhc_info_url_{$i}", array(
			'label'   => sprintf( __( 'バナー %d リンク先', 'szokhc' ), $i ),
			'section' => 'szokhc_infogrid',
			'type'    => 'url',
		) );
	}

	/* ----- クイックリンク4枚 ----- */
	$wp_customize->add_section( 'szokhc_quicklinks', array(
		'title'    => __( 'トップ：クイックリンク (4枚)', 'szokhc' ),
		'priority' => 65,
	) );
	for ( $i = 1; $i <= 4; $i++ ) {
		$wp_customize->add_setting( "szokhc_quick_image_{$i}", array( 'sanitize_callback' => 'esc_url_raw' ) );
		$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, "szokhc_quick_image_{$i}", array(
			'label'   => sprintf( __( 'リンク %d 画像', 'szokhc' ), $i ),
			'section' => 'szokhc_quicklinks',
		) ) );
		$wp_customize->add_setting( "szokhc_quick_url_{$i}", array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		) );
		$wp_customize->add_control( "szokhc_quick_url_{$i}", array(
			'label'   => sprintf( __( 'リンク %d URL', 'szokhc' ), $i ),
			'section' => 'szokhc_quicklinks',
			'type'    => 'url',
		) );
		$wp_customize->add_setting( "szokhc_quick_target_{$i}", array(
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
		) );
		$wp_customize->add_control( "szokhc_quick_target_{$i}", array(
			'label'   => sprintf( __( 'リンク %d 外部 (_blank で開く)', 'szokhc' ), $i ),
			'section' => 'szokhc_quicklinks',
			'type'    => 'checkbox',
		) );
	}

	/* ----- アクセス／採用 ----- */
	$wp_customize->add_section( 'szokhc_access', array(
		'title'    => __( 'トップ：アクセス／採用', 'szokhc' ),
		'priority' => 70,
	) );
	$wp_customize->add_setting( 'szokhc_access_photo', array( 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'szokhc_access_photo', array(
		'label'   => __( 'クリニック外観写真', 'szokhc' ),
		'section' => 'szokhc_access',
	) ) );
	$wp_customize->add_setting( 'szokhc_map_embed', array(
		'default'           => '',
		'sanitize_callback' => 'wp_kses_post',
	) );
	$wp_customize->add_control( 'szokhc_map_embed', array(
		'label'       => __( 'Googleマップ iframe コード', 'szokhc' ),
		'description' => __( 'Googleマップの「埋め込みコード」をそのまま貼り付け', 'szokhc' ),
		'section'     => 'szokhc_access',
		'type'        => 'textarea',
	) );
	$wp_customize->add_setting( 'szokhc_recruit_image', array( 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'szokhc_recruit_image', array(
		'label'   => __( '採用バナー画像', 'szokhc' ),
		'section' => 'szokhc_access',
	) ) );
	$wp_customize->add_setting( 'szokhc_recruit_url', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'szokhc_recruit_url', array(
		'label'   => __( '採用バナー リンク先', 'szokhc' ),
		'section' => 'szokhc_access',
		'type'    => 'url',
	) );

	/* ----- 貞栄会グループ ----- */
	$wp_customize->add_section( 'szokhc_group', array(
		'title'    => __( 'トップ：貞栄会グループ', 'szokhc' ),
		'priority' => 75,
	) );
	$wp_customize->add_setting( 'szokhc_group_lead', array(
		'default'           => '',
		'sanitize_callback' => 'wp_kses_post',
	) );
	$wp_customize->add_control( 'szokhc_group_lead', array(
		'label'   => __( '紹介文', 'szokhc' ),
		'section' => 'szokhc_group',
		'type'    => 'textarea',
	) );
	for ( $i = 1; $i <= 6; $i++ ) {
		$wp_customize->add_setting( "szokhc_group_image_{$i}", array( 'sanitize_callback' => 'esc_url_raw' ) );
		$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, "szokhc_group_image_{$i}", array(
			'label'   => sprintf( __( 'グループバナー %d 画像', 'szokhc' ), $i ),
			'section' => 'szokhc_group',
		) ) );
		$wp_customize->add_setting( "szokhc_group_url_{$i}", array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		) );
		$wp_customize->add_control( "szokhc_group_url_{$i}", array(
			'label'   => sprintf( __( 'グループバナー %d リンク先', 'szokhc' ), $i ),
			'section' => 'szokhc_group',
			'type'    => 'url',
		) );
	}

	/* ----- 固定問い合わせボタン ----- */
	$wp_customize->add_section( 'szokhc_floating', array(
		'title'    => __( 'トップ：右下固定ボタン', 'szokhc' ),
		'priority' => 80,
	) );
	$wp_customize->add_setting( 'szokhc_floating_image', array( 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'szokhc_floating_image', array(
		'label'   => __( 'ボタン画像', 'szokhc' ),
		'section' => 'szokhc_floating',
	) ) );
	$wp_customize->add_setting( 'szokhc_floating_url', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'szokhc_floating_url', array(
		'label'   => __( 'リンク先', 'szokhc' ),
		'section' => 'szokhc_floating',
		'type'    => 'url',
	) );

} );
