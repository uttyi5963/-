<?php
/**
 * Global footer.
 *
 * @package Szokhc
 */
?>
</main><!-- /#site-main -->

<?php get_template_part( 'template-parts/floating-cta' ); ?>

<footer class="site-footer" role="contentinfo">
	<div class="container">
		<div class="site-footer__sig">
			<?php
			$org    = szokhc_mod( 'szokhc_org_name' );
			$clinic = szokhc_mod( 'szokhc_clinic_name', get_bloginfo( 'name' ) );
			echo esc_html( trim( $org . '　' . $clinic ) );
			?>
		</div>
		<address class="site-footer__address">
			<?php
			$postal  = szokhc_mod( 'szokhc_postal' );
			$address = szokhc_mod( 'szokhc_address' );
			$tel     = szokhc_mod( 'szokhc_tel' );
			$fax     = szokhc_mod( 'szokhc_fax' );
			if ( $postal ) {
				echo '〒' . esc_html( $postal ) . ' ';
			}
			echo esc_html( $address );
			if ( $tel || $fax ) {
				echo '<br>';
				if ( $tel ) {
					echo 'TEL：' . esc_html( $tel );
				}
				if ( $fax ) {
					echo '  FAX：' . esc_html( $fax );
				}
			}
			?>
		</address>
		<p class="site-footer__copy">
			Copyright&copy; <?php echo esc_html( szokhc_mod( 'szokhc_org_name' ) . '　' . szokhc_mod( 'szokhc_clinic_name', get_bloginfo( 'name' ) ) ); ?> All Rights Reserved.
		</p>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
