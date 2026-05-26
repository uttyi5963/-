<?php
/**
 * Intro lead block (philosophy statement + paired images).
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$title       = szokhc_mod( 'szokhc_intro_title' );
$body        = szokhc_mod( 'szokhc_intro_body' );
$img_left    = szokhc_mod( 'szokhc_intro_image_left' );
$img_right   = szokhc_mod( 'szokhc_intro_image_right' );
$img_right_u = szokhc_mod( 'szokhc_intro_image_right_url' );
$img_below   = szokhc_mod( 'szokhc_intro_below_image' );

if ( ! ( $title || $body || $img_left || $img_right || $img_below ) ) { return; }
?>
<section class="section intro">
	<div class="container">
		<?php if ( $title ) : ?>
			<p class="lead-heading"><?php echo wp_kses_post( nl2br( $title ) ); ?></p>
			<hr class="lead-divider">
		<?php endif; ?>

		<?php if ( $body ) : ?>
			<p class="intro__lead"><?php echo wp_kses_post( nl2br( $body ) ); ?></p>
		<?php endif; ?>

		<?php if ( $img_left || $img_right ) : ?>
			<div class="intro__images">
				<div>
					<?php if ( $img_left ) : ?>
						<img src="<?php echo esc_url( $img_left ); ?>" alt="">
					<?php endif; ?>
				</div>
				<div>
					<?php if ( $img_right ) : ?>
						<?php if ( $img_right_u ) : ?>
							<a href="<?php echo esc_url( $img_right_u ); ?>"><img src="<?php echo esc_url( $img_right ); ?>" alt=""></a>
						<?php else : ?>
							<img src="<?php echo esc_url( $img_right ); ?>" alt="">
						<?php endif; ?>
					<?php endif; ?>
				</div>
			</div>
		<?php endif; ?>

		<?php if ( $img_below ) : ?>
			<div class="intro__below">
				<img src="<?php echo esc_url( $img_below ); ?>" alt="">
			</div>
		<?php endif; ?>
	</div>
</section>
