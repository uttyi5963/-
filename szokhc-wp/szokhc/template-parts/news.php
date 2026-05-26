<?php
/**
 * News + Column dual feed (2 column).
 *
 * 左: お知らせ（投稿） / 右: 在宅医療の教科書（szk_column）。
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
<section class="section news-section">
	<div class="container">
		<div class="col-2">
			<div class="news-block">
				<div class="news-block__head">
					<h2><?php esc_html_e( 'お知らせ', 'szokhc' ); ?></h2>
				</div>
				<?php
				$news = new WP_Query( array(
					'post_type'      => 'post',
					'posts_per_page' => 3,
					'no_found_rows'  => true,
				) );
				if ( $news->have_posts() ) :
					while ( $news->have_posts() ) : $news->the_post(); ?>
						<dl>
							<dt><?php echo esc_html( get_the_date( 'Y年n月j日' ) ); ?></dt>
							<dd><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></dd>
						</dl>
					<?php endwhile;
					wp_reset_postdata();
				else : ?>
					<p style="padding:12px 0;color:#888;font-size:13px;">
						<?php esc_html_e( 'お知らせはまだ投稿されていません。', 'szokhc' ); ?>
					</p>
				<?php endif; ?>
				<p class="pill-btn--wrap">
					<a class="pill-btn" href="<?php echo esc_url( get_post_type_archive_link( 'post' ) ?: home_url( '/news/' ) ); ?>"><?php esc_html_e( 'お知らせ一覧', 'szokhc' ); ?></a>
				</p>
			</div>

			<div class="news-block">
				<div class="news-block__head">
					<h2><?php esc_html_e( '在宅医療の教科書', 'szokhc' ); ?></h2>
					<a href="<?php echo esc_url( get_post_type_archive_link( 'szk_column' ) ?: home_url( '/column/' ) ); ?>"><?php esc_html_e( '一覧へ', 'szokhc' ); ?></a>
				</div>
				<?php
				$col = new WP_Query( array(
					'post_type'      => 'szk_column',
					'posts_per_page' => 3,
					'no_found_rows'  => true,
				) );
				if ( $col->have_posts() ) :
					while ( $col->have_posts() ) : $col->the_post(); ?>
						<dl>
							<dt><?php echo esc_html( get_the_date( 'Y年n月j日' ) ); ?></dt>
							<dd><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></dd>
						</dl>
					<?php endwhile;
					wp_reset_postdata();
				else : ?>
					<p style="padding:12px 0;color:#888;font-size:13px;">
						<?php esc_html_e( '記事はまだ公開されていません。', 'szokhc' ); ?>
					</p>
				<?php endif; ?>
				<p class="pill-btn--wrap">
					<a class="pill-btn" href="<?php echo esc_url( get_post_type_archive_link( 'szk_column' ) ?: home_url( '/column/' ) ); ?>"><?php esc_html_e( '一覧を見る', 'szokhc' ); ?></a>
				</p>
			</div>
		</div>
	</div>
</section>
