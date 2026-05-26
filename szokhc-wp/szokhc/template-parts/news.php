<?php
/**
 * Latest news section.
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$q = szokhc_news_query( 5 );
if ( ! $q->have_posts() ) { return; }
?>
<section class="section section--soft news">
	<div class="container">
		<div class="news__head">
			<h2 class="section__title"><?php esc_html_e( 'お知らせ', 'szokhc' ); ?></h2>
			<a class="news__more" href="<?php echo esc_url( get_post_type_archive_link( 'post' ) ?: home_url( '/news/' ) ); ?>">
				<?php esc_html_e( '一覧を見る', 'szokhc' ); ?> →
			</a>
		</div>
		<ul class="news-list">
			<?php while ( $q->have_posts() ) : $q->the_post(); ?>
				<li class="news-list__item">
					<span class="news-list__date"><?php echo esc_html( szokhc_format_date() ); ?></span>
					<?php $cat = szokhc_primary_category(); if ( $cat ) : ?>
						<span class="news-list__cat"><?php echo esc_html( $cat ); ?></span>
					<?php else : ?>
						<span></span>
					<?php endif; ?>
					<h3 class="news-list__title">
						<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
					</h3>
				</li>
			<?php endwhile; wp_reset_postdata(); ?>
		</ul>
	</div>
</section>
