<?php
/**
 * Symptoms / rheumatism appeal block.
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$heading    = szokhc_mod( 'szokhc_symptoms_heading' );
$image      = szokhc_mod( 'szokhc_symptoms_image' );
$body       = szokhc_mod( 'szokhc_symptoms_body' );
$link_image = szokhc_mod( 'szokhc_symptoms_link_image' );
$link_url   = szokhc_mod( 'szokhc_symptoms_link_url' );
$below      = szokhc_mod( 'szokhc_symptoms_below_image' );

if ( ! ( $heading || $image || $body || $below ) ) { return; }
?>
<section class="section symptoms-section">
	<div class="container">
		<?php if ( $heading ) : ?>
			<div class="heading"><span class="heading__text"><?php echo esc_html( $heading ); ?></span></div>
		<?php endif; ?>

		<div class="symptoms">
			<div class="symptoms__image">
				<?php if ( $image ) : ?>
					<img src="<?php echo esc_url( $image ); ?>" alt="">
				<?php endif; ?>
			</div>
			<div class="symptoms__copy">
				<?php if ( $body ) : ?>
					<?php echo wp_kses_post( wpautop( $body ) ); ?>
				<?php endif; ?>
				<?php if ( $link_image ) : ?>
					<p style="text-align:right;">
						<?php if ( $link_url ) : ?>
							<a href="<?php echo esc_url( $link_url ); ?>"><img src="<?php echo esc_url( $link_image ); ?>" alt=""></a>
						<?php else : ?>
							<img src="<?php echo esc_url( $link_image ); ?>" alt="">
						<?php endif; ?>
					</p>
				<?php endif; ?>
			</div>
		</div>

		<?php if ( $below ) : ?>
			<div class="symptoms__below" style="margin-top:24px;">
				<img src="<?php echo esc_url( $below ); ?>" alt="">
			</div>
		<?php endif; ?>
	</div>
</section>
