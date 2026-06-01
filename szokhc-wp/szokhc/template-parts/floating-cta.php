<?php
/**
 * Fixed bottom-right CTA button.
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$img = szokhc_mod( 'szokhc_floating_image' );
$url = szokhc_mod( 'szokhc_floating_url' );
if ( ! ( $img && $url ) ) { return; }
?>
<div class="floating-cta">
	<a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener">
		<img src="<?php echo esc_url( $img ); ?>" alt="<?php esc_attr_e( 'お問い合わせ', 'szokhc' ); ?>">
	</a>
</div>
