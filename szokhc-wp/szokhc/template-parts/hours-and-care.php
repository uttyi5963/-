<?php
/**
 * 2-column wrapper: 診療時間 + 診療のかたち.
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
<section class="section section--soft hours-and-care">
	<div class="container">
		<div class="col-2">
			<div><?php get_template_part( 'template-parts/clinic-hours' ); ?></div>
			<div><?php get_template_part( 'template-parts/care-styles' ); ?></div>
		</div>
	</div>
</section>
