<?php
/**
 * Conference / lecture highlights.
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$q = new WP_Query( array(
	'post_type'      => 'szk_conference',
	'posts_per_page' => 3,
	'no_found_rows'  => true,
) );
if ( ! $q->have_posts() ) { return; }
?>
<section class="section conference">
	<div class="container">
		<h2 class="section__title"><?php esc_html_e( '講演会情報', 'szokhc' ); ?></h2>
		<div class="card-grid">
			<?php while ( $q->have_posts() ) : $q->the_post(); ?>
				<a class="card" href="<?php the_permalink(); ?>">
					<?php if ( has_post_thumbnail() ) : ?>
						<div class="card__thumb"><?php the_post_thumbnail( 'szokhc-card' ); ?></div>
					<?php endif; ?>
					<p class="card__date"><?php echo esc_html( szokhc_format_date() ); ?></p>
					<h3 class="card__title"><?php the_title(); ?></h3>
				</a>
			<?php endwhile; wp_reset_postdata(); ?>
		</div>
	</div>
</section>
