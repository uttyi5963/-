<?php
/**
 * Sister site banner list (貞栄会グループ).
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$lead = szokhc_mod( 'szokhc_group_lead' );
$banners = array();
for ( $i = 1; $i <= 6; $i++ ) {
	$img = szokhc_mod( "szokhc_group_image_{$i}" );
	if ( $img ) {
		$banners[] = array(
			'image' => $img,
			'url'   => szokhc_mod( "szokhc_group_url_{$i}" ),
		);
	}
}
if ( ! ( $lead || $banners ) ) { return; }
?>
<section class="section group-section">
	<div class="container">
		<?php if ( $lead ) : ?>
			<p class="group__lead">
				<span class="mark">●</span>
				<span class="title"><?php esc_html_e( '貞栄会グループ', 'szokhc' ); ?></span><br>
				<span class="body"><?php echo wp_kses_post( $lead ); ?></span>
			</p>
		<?php endif; ?>

		<?php if ( $banners ) : ?>
			<ul class="group__banners">
				<?php foreach ( $banners as $b ) : ?>
					<li>
						<?php if ( $b['url'] ) : ?>
							<a href="<?php echo esc_url( $b['url'] ); ?>" target="_blank" rel="noopener">
								<img src="<?php echo esc_url( $b['image'] ); ?>" alt="">
							</a>
						<?php else : ?>
							<img src="<?php echo esc_url( $b['image'] ); ?>" alt="">
						<?php endif; ?>
					</li>
				<?php endforeach; ?>
			</ul>
		<?php endif; ?>
	</div>
</section>
