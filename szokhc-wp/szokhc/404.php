<?php
/**
 * 404 Not Found.
 *
 * @package Szokhc
 */

get_header();
?>

<div class="container section">
	<h1 class="section__title"><?php esc_html_e( 'ページが見つかりませんでした', 'szokhc' ); ?></h1>
	<p class="section__lead">
		<?php esc_html_e( 'お探しのページは移動または削除された可能性があります。', 'szokhc' ); ?>
	</p>
	<p><a class="btn" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'トップへ戻る', 'szokhc' ); ?></a></p>
	<?php get_search_form(); ?>
</div>

<?php
get_footer();
