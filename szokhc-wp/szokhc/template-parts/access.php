<?php
/**
 * Access / contact information block.
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$address = szokhc_mod( 'szokhc_address' );
$tel     = szokhc_mod( 'szokhc_tel' );
$fax     = szokhc_mod( 'szokhc_fax' );
$hours   = szokhc_mod( 'szokhc_hours' );
$note    = szokhc_mod( 'szokhc_hours_note' );

if ( ! ( $address || $tel || $hours ) ) { return; }
?>
<section class="section section--soft access">
	<div class="container access__grid">
		<div class="access__info">
			<h2 class="section__title"><?php esc_html_e( '受診時間・アクセス', 'szokhc' ); ?></h2>
			<?php if ( $address ) : ?>
				<p class="access__address"><?php echo esc_html( $address ); ?></p>
			<?php endif; ?>
			<?php if ( $tel ) : ?>
				<p class="access__tel">
					TEL <a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $tel ) ); ?>">
						<?php echo esc_html( $tel ); ?>
					</a>
					<?php if ( $fax ) : ?> / FAX <?php echo esc_html( $fax ); ?><?php endif; ?>
				</p>
			<?php endif; ?>
			<?php if ( $hours ) : ?>
				<dl class="access__hours">
					<dt><?php esc_html_e( '受付時間', 'szokhc' ); ?></dt>
					<dd><?php echo wp_kses_post( nl2br( $hours ) ); ?></dd>
				</dl>
			<?php endif; ?>
			<?php if ( $note ) : ?>
				<p class="access__note"><?php echo esc_html( $note ); ?></p>
			<?php endif; ?>
		</div>
		<div class="access__map">
			<?php
			/**
			 * Googleマップ埋め込みは管理画面の固定ページ
			 * 「受診時間・アクセス」配下のブロックで管理する想定。
			 * ここではプレースホルダのみ。
			 */
			?>
			<div class="access__map-placeholder" aria-hidden="true"></div>
		</div>
	</div>
</section>
