<?php
/**
 * Archive template (お知らせ・講演会・タクソノミー共通).
 *
 * @package Szokhc
 */

get_header();
?>

<div class="container section">
	<header class="archive__head">
		<h1 class="archive__title">
			<?php
			if ( is_post_type_archive() ) {
				post_type_archive_title();
			} elseif ( is_tax() || is_category() || is_tag() ) {
				single_term_title();
			} elseif ( is_date() ) {
				echo esc_html( get_the_date( 'Y年n月' ) );
			} else {
				esc_html_e( 'アーカイブ', 'szokhc' );
			}
			?>
		</h1>
		<?php $desc = term_description(); if ( $desc ) : ?>
			<div class="archive__desc"><?php echo wp_kses_post( $desc ); ?></div>
		<?php endif; ?>
	</header>

	<?php if ( have_posts() ) : ?>
		<ul class="news-list">
			<?php while ( have_posts() ) : the_post(); ?>
				<li class="news-list__item">
					<span class="news-list__date"><?php echo esc_html( szokhc_format_date() ); ?></span>
					<?php $cat = szokhc_primary_category(); if ( $cat ) : ?>
						<span class="news-list__cat"><?php echo esc_html( $cat ); ?></span>
					<?php else : ?>
						<span></span>
					<?php endif; ?>
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
		<p><?php esc_html_e( '記事はまだありません。', 'szokhc' ); ?></p>
	<?php endif; ?>
</div>

<?php
get_footer();
