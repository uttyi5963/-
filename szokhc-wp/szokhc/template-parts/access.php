<?php
/**
 * Access (photo + map) and recruit banner.
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$photo   = szokhc_mod( 'szokhc_access_photo' );
$map     = szokhc_mod( 'szokhc_map_embed' );
$rec_img = szokhc_mod( 'szokhc_recruit_image' );
$rec_url = szokhc_mod( 'szokhc_recruit_url' );

if ( ! ( $photo || $map || $rec_img ) ) { return; }
?>
<section class="section access-section">
	<div class="container">
		<div class="access">
			<div class="access__left">
				<?php if ( $photo ) : ?>
					<div class="access__photo"><img src="<?php echo esc_url( $photo ); ?>" alt=""></div>
				<?php endif; ?>
				<?php if ( $map ) : ?>
					<div class="access__map">
						<?php
						$allowed = array(
							'iframe' => array(
								'src'             => true,
								'width'           => true,
								'height'          => true,
								'style'           => true,
								'allowfullscreen' => true,
								'loading'         => true,
								'referrerpolicy'  => true,
								'title'           => true,
							),
						);
						echo wp_kses( $map, $allowed );
						?>
					</div>
				<?php endif; ?>
			</div>
			<div class="access__right">
				<?php if ( $rec_img ) : ?>
					<div class="access__recruit">
						<?php if ( $rec_url ) : ?>
							<a href="<?php echo esc_url( $rec_url ); ?>" target="_blank" rel="noopener">
								<img src="<?php echo esc_url( $rec_img ); ?>" alt="">
							</a>
						<?php else : ?>
							<img src="<?php echo esc_url( $rec_img ); ?>" alt="">
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</div>
</section>
