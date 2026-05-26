<?php
/**
 * Fallback template.
 *
 * @package Szokhc
 */

get_header();
?>

<div class="container section">
	<?php if ( have_posts() ) : ?>
		<?php while ( have_posts() ) : the_post(); ?>
			<article <?php post_class( 'entry' ); ?>>
				<header class="entry__head">
					<h2 class="entry__title">
						<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
					</h2>
					<p class="entry__meta"><?php echo esc_html( szokhc_format_date() ); ?></p>
				</header>
				<div class="entry__excerpt">
					<?php the_excerpt(); ?>
				</div>
			</article>
		<?php endwhile; ?>
		<nav class="pagination">
			<?php the_posts_pagination(); ?>
		</nav>
	<?php else : ?>
		<p><?php esc_html_e( '記事が見つかりませんでした。', 'szokhc' ); ?></p>
	<?php endif; ?>
</div>

<?php
get_footer();
