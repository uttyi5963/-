<?php
/**
 * Single post / CPT template.
 *
 * @package Szokhc
 */

get_header();
?>

<div class="container section">
	<?php while ( have_posts() ) : the_post(); ?>
		<article <?php post_class( 'single-entry' ); ?>>
			<header class="single-entry__head">
				<p class="single-entry__meta">
					<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
						<?php echo esc_html( szokhc_format_date() ); ?>
					</time>
					<?php $cat = szokhc_primary_category(); if ( $cat ) : ?>
						<span class="single-entry__cat"><?php echo esc_html( $cat ); ?></span>
					<?php endif; ?>
				</p>
				<h1 class="single-entry__title"><?php the_title(); ?></h1>
			</header>

			<?php if ( has_post_thumbnail() ) : ?>
				<div class="single-entry__thumb"><?php the_post_thumbnail( 'szokhc-hero' ); ?></div>
			<?php endif; ?>

			<div class="single-entry__body">
				<?php the_content(); ?>
			</div>

			<footer class="single-entry__foot">
				<nav class="single-entry__pager">
					<?php previous_post_link( '<span class="prev">%link</span>', '&larr; %title' ); ?>
					<?php next_post_link( '<span class="next">%link</span>', '%title &rarr;' ); ?>
				</nav>
			</footer>
		</article>
	<?php endwhile; ?>
</div>

<?php
get_footer();
