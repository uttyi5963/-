<?php
/**
 * Main visual slider.
 *
 * Customizer の szokhc_mv_image_1..5 を順に表示。1枚なら静止、複数枚で自動切替。
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$slides = array();
for ( $i = 1; $i <= 5; $i++ ) {
	$img = szokhc_mod( "szokhc_mv_image_{$i}" );
	if ( $img ) {
		$slides[] = array(
			'image' => $img,
			'url'   => szokhc_mod( "szokhc_mv_url_{$i}" ),
		);
	}
}
if ( empty( $slides ) ) { return; }
?>
<div class="mainvisual" data-szokhc-slider data-interval="6000">
	<ul class="mainvisual__list">
		<?php foreach ( $slides as $idx => $slide ) : ?>
			<li<?php echo $idx === 0 ? ' class="is-active"' : ''; ?>>
				<?php if ( $slide['url'] ) : ?>
					<a href="<?php echo esc_url( $slide['url'] ); ?>">
						<img src="<?php echo esc_url( $slide['image'] ); ?>" alt="">
					</a>
				<?php else : ?>
					<img src="<?php echo esc_url( $slide['image'] ); ?>" alt="">
				<?php endif; ?>
			</li>
		<?php endforeach; ?>
	</ul>
</div>
