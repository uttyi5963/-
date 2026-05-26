<?php
/**
 * Front page template.
 *
 * セクション順をこのファイル1箇所で管理する。各セクションは
 * template-parts/ に分離され、内容は Customizer / CPT / 投稿から
 * 動的に取得される。
 *
 * @package Szokhc
 */

get_header();
?>

<?php get_template_part( 'template-parts/hero' ); ?>

<?php get_template_part( 'template-parts/intro' ); ?>

<?php get_template_part( 'template-parts/hours-and-care' ); ?>

<?php get_template_part( 'template-parts/symptoms' ); ?>

<?php get_template_part( 'template-parts/news' ); ?>

<?php get_template_part( 'template-parts/info-grid' ); ?>

<?php get_template_part( 'template-parts/quick-links' ); ?>

<?php get_template_part( 'template-parts/access' ); ?>

<?php get_template_part( 'template-parts/group' ); ?>

<?php
get_footer();
