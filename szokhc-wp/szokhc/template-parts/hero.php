<?php
/**
 * Front page hero block.
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$title    = szokhc_mod( 'szokhc_hero_title' );
$lead     = szokhc_mod( 'szokhc_hero_lead' );
$cta1     = szokhc_mod( 'szokhc_hero_cta1' );
$cta1_url = szokhc_mod( 'szokhc_hero_cta1_url' );
$cta2     = szokhc_mod( 'szokhc_hero_cta2' );
$cta2_url = szokhc_mod( 'szokhc_hero_cta2_url' );
$image    = szokhc_mod( 'szokhc_hero_image' );

$style = $image ? sprintf( 'style="background-image:linear-gradient(rgba(255,255,255,.7),rgba(255,255,255,.7)),url(%s);background-size:cover;background-position:center;"', esc_url( $image ) ) : '';
?>
<section class="hero" <?php echo $style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="container">
		<?php if ( $title ) : ?>
			<h1 class="hero__title"><?php echo wp_kses_post( $title ); ?></h1>
		<?php endif; ?>
		<?php if ( $lead ) : ?>
			<p class="hero__lead"><?php echo wp_kses_post( $lead ); ?></p>
		<?php endif; ?>
		<?php if ( $cta1 || $cta2 ) : ?>
			<p class="hero__cta">
				<?php if ( $cta1 ) : ?>
					<a class="btn" href="<?php echo esc_url( $cta1_url ?: '#' ); ?>"><?php echo esc_html( $cta1 ); ?></a>
				<?php endif; ?>
				<?php if ( $cta2 ) : ?>
					<a class="btn btn--ghost" href="<?php echo esc_url( $cta2_url ?: '#' ); ?>"><?php echo esc_html( $cta2 ); ?></a>
				<?php endif; ?>
			</p>
		<?php endif; ?>
	</div>
</section>
