<?php
/**
 * Front page template.
 *
 * トップページのセクション並び。実コンテンツはCustomizer・固定ページ・
 * 各CPT・お知らせ投稿から読み込まれるため、ここではセクション順序だけ
 * 管理する。並び替えはこのファイルを編集するだけで反映できる。
 *
 * @package Szokhc
 */

get_header();
?>

<?php get_template_part( 'template-parts/hero' ); ?>

<?php get_template_part( 'template-parts/audience-nav' ); ?>

<?php get_template_part( 'template-parts/news' ); ?>

<?php get_template_part( 'template-parts/services' ); ?>

<?php get_template_part( 'template-parts/access' ); ?>

<?php get_template_part( 'template-parts/conference' ); ?>

<?php
get_footer();
