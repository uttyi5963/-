<?php
/**
 * Global footer.
 *
 * @package Szokhc
 */
?>
</main><!-- /#site-main -->

<footer class="site-footer" role="contentinfo">
	<div class="container">
		<div class="site-footer__cols">
			<div class="site-footer__col">
				<p class="site-footer__brand">
					<strong><?php echo esc_html( szokhc_mod( 'szokhc_clinic_name', get_bloginfo( 'name' ) ) ); ?></strong>
				</p>
				<p><?php echo esc_html( szokhc_mod( 'szokhc_address' ) ); ?></p>
				<p>
					<?php $tel = szokhc_mod( 'szokhc_tel' ); if ( $tel ) : ?>
						TEL <a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $tel ) ); ?>"><?php echo esc_html( $tel ); ?></a>
					<?php endif; ?>
					<?php $fax = szokhc_mod( 'szokhc_fax' ); if ( $fax ) : ?>
						 / FAX <?php echo esc_html( $fax ); ?>
					<?php endif; ?>
				</p>
			</div>
			<?php for ( $i = 1; $i <= 3; $i++ ) : ?>
				<div class="site-footer__col">
					<?php if ( is_active_sidebar( 'footer-' . $i ) ) : ?>
						<?php dynamic_sidebar( 'footer-' . $i ); ?>
					<?php endif; ?>
				</div>
			<?php endfor; ?>
		</div>

		<nav class="site-footer__nav" aria-label="<?php esc_attr_e( 'フッターナビ', 'szokhc' ); ?>">
			<?php
			wp_nav_menu( array(
				'theme_location' => 'footer',
				'container'      => false,
				'depth'          => 1,
				'fallback_cb'    => false,
			) );
			?>
		</nav>

		<p class="site-footer__bottom">
			&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?> <?php echo esc_html( szokhc_mod( 'szokhc_org_name', get_bloginfo( 'name' ) ) ); ?>
		</p>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
