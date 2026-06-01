<?php
/**
 * Quick links banner row (4 cards).
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$items = array();
for ( $i = 1; $i <= 4; $i++ ) {
	$img = szokhc_mod( "szokhc_quick_image_{$i}" );
	if ( $img ) {
		$items[] = array(
			'image'  => $img,
			'url'    => szokhc_mod( "szokhc_quick_url_{$i}" ),
			'target' => szokhc_mod( "szokhc_quick_target_{$i}" ) ? '_blank' : '',
		);
	}
}
if ( empty( $items ) ) { return; }
?>
<section class="section section--tight quick-links-section">
	<div class="container">
		<div class="quick-links">
			<?php foreach ( $items as $item ) : ?>
				<?php if ( $item['url'] ) : ?>
					<a href="<?php echo esc_url( $item['url'] ); ?>"<?php echo $item['target'] ? ' target="_blank" rel="noopener"' : ''; ?>>
						<img src="<?php echo esc_url( $item['image'] ); ?>" alt="">
					</a>
				<?php else : ?>
					<span><img src="<?php echo esc_url( $item['image'] ); ?>" alt=""></span>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
	</div>
</section>
