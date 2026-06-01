<?php
/**
 * 3-column banner grid.
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$items = array();
for ( $i = 1; $i <= 3; $i++ ) {
	$img = szokhc_mod( "szokhc_info_image_{$i}" );
	if ( $img ) {
		$items[] = array(
			'image' => $img,
			'url'   => szokhc_mod( "szokhc_info_url_{$i}" ),
		);
	}
}
if ( empty( $items ) ) { return; }
?>
<section class="section info-grid-section">
	<div class="container">
		<div class="info-grid">
			<?php foreach ( $items as $item ) : ?>
				<?php if ( $item['url'] ) : ?>
					<a href="<?php echo esc_url( $item['url'] ); ?>"><img src="<?php echo esc_url( $item['image'] ); ?>" alt=""></a>
				<?php else : ?>
					<span><img src="<?php echo esc_url( $item['image'] ); ?>" alt=""></span>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
	</div>
</section>
