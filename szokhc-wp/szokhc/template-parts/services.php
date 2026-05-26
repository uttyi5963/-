<?php
/**
 * Services / departments grid.
 *
 * 診療メニュー（在宅診療、リウマチ・膠原病など）をCPT
 * szk_service から取得して並べる。menu_order で順序制御。
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$q = new WP_Query( array(
	'post_type'      => 'szk_service',
	'posts_per_page' => 8,
	'orderby'        => 'menu_order title',
	'order'          => 'ASC',
	'no_found_rows'  => true,
) );

if ( ! $q->have_posts() ) { return; }
?>
<section class="section services">
	<div class="container">
		<h2 class="section__title"><?php esc_html_e( '診療のご案内', 'szokhc' ); ?></h2>
		<div class="card-grid">
			<?php while ( $q->have_posts() ) : $q->the_post(); ?>
				<a class="card service-card" href="<?php the_permalink(); ?>">
					<?php if ( has_post_thumbnail() ) : ?>
						<div class="card__thumb"><?php the_post_thumbnail( 'szokhc-card' ); ?></div>
					<?php endif; ?>
					<h3 class="card__title"><?php the_title(); ?></h3>
					<?php $excerpt = get_the_excerpt(); if ( $excerpt ) : ?>
						<p class="card__lead"><?php echo esc_html( wp_strip_all_tags( $excerpt ) ); ?></p>
					<?php endif; ?>
				</a>
			<?php endwhile; wp_reset_postdata(); ?>
		</div>
	</div>
</section>
