<?php
/**
 * Care styles block (診療のかたち).
 *
 * 4枚の画像リンクカード（在宅 / 外来 / オンライン / その他など）。
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$lead = szokhc_mod( 'szokhc_carestyles_lead' );
$cards = array();
for ( $i = 1; $i <= 4; $i++ ) {
	$img = szokhc_mod( "szokhc_carestyle_image_{$i}" );
	if ( $img ) {
		$cards[] = array(
			'image' => $img,
			'url'   => szokhc_mod( "szokhc_carestyle_url_{$i}" ),
		);
	}
}
?>
<div class="care-styles">
	<div class="heading"><span class="heading__text"><?php esc_html_e( '診療のかたち', 'szokhc' ); ?></span></div>
	<?php if ( $lead ) : ?>
		<p class="care-styles__lead"><?php echo wp_kses_post( $lead ); ?></p>
	<?php endif; ?>
	<?php if ( ! empty( $cards ) ) : ?>
		<div class="care-styles__grid">
			<?php foreach ( $cards as $c ) : ?>
				<?php if ( $c['url'] ) : ?>
					<a href="<?php echo esc_url( $c['url'] ); ?>"><img src="<?php echo esc_url( $c['image'] ); ?>" alt=""></a>
				<?php else : ?>
					<img src="<?php echo esc_url( $c['image'] ); ?>" alt="">
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</div>
