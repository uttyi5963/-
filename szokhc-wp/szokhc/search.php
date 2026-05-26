<?php
/**
 * Search results template.
 *
 * @package Szokhc
 */

get_header();
?>

<div class="container section">
	<header class="archive__head">
		<h1 class="archive__title">
			<?php printf( esc_html__( '「%s」の検索結果', 'szokhc' ), esc_html( get_search_query() ) ); ?>
		</h1>
	</header>

	<?php if ( have_posts() ) : ?>
		<ul class="news-list">
			<?php while ( have_posts() ) : the_post(); ?>
				<li class="news-list__item">
					<span class="news-list__date"><?php echo esc_html( szokhc_format_date() ); ?></span>
					<span></span>
					<h2 class="news-list__title">
						<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
					</h2>
				</li>
			<?php endwhile; ?>
		</ul>
		<nav class="pagination">
			<?php the_posts_pagination(); ?>
		</nav>
	<?php else : ?>
		<p><?php esc_html_e( '該当する記事が見つかりませんでした。', 'szokhc' ); ?></p>
		<?php get_search_form(); ?>
	<?php endif; ?>
</div>

<?php
get_footer();
