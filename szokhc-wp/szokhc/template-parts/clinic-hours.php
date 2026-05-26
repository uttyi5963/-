<?php
/**
 * Clinic hours block.
 *
 * 外来診療時間テーブル + 在宅診療24時間365日案内の2カラム。
 * 「診療のかたち」セクションと並ぶ左カラム想定。単独でも使える。
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$slot     = szokhc_mod( 'szokhc_hours_outpatient_label', '8:45 – 10:00' );
$pattern  = szokhc_mod( 'szokhc_hours_pattern', '○,○,○,○,○,-,-' );
$closed   = szokhc_mod( 'szokhc_hours_closed' );
$hc_note  = szokhc_mod( 'szokhc_homecare_note' );
$hc_link  = szokhc_mod( 'szokhc_homecare_link' );
$days     = array( '月', '火', '水', '木', '金', '土', '日' );
$marks    = array_pad( array_map( 'trim', explode( ',', $pattern ) ), 7, '-' );
?>
<div class="clinic-hours">
	<div class="heading"><span class="heading__text"><?php esc_html_e( '診療時間', 'szokhc' ); ?></span></div>

	<p class="lead-heading lead-heading--sub">
		<span class="lead-heading--mark">●</span>
		<?php esc_html_e( '外来診療時間', 'szokhc' ); ?>
		<span class="lead-heading--warn"><?php esc_html_e( '　予約制', 'szokhc' ); ?></span>
	</p>

	<table class="hours-table">
		<thead>
			<tr>
				<th><?php esc_html_e( '診療時間', 'szokhc' ); ?></th>
				<?php foreach ( $days as $d ) : ?>
					<th><?php echo esc_html( $d ); ?></th>
				<?php endforeach; ?>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><?php echo esc_html( $slot ); ?></td>
				<?php foreach ( $marks as $m ) : ?>
					<td><span class="hours-table__mark"><?php echo esc_html( $m ); ?></span></td>
				<?php endforeach; ?>
			</tr>
		</tbody>
	</table>

	<?php if ( $closed ) : ?>
		<p class="hours-note">
			<span class="hours-note__label">[休診日]</span> <?php echo esc_html( $closed ); ?>
		</p>
	<?php endif; ?>

	<hr class="lead-divider lead-divider--dashed lead-divider--full">

	<div class="hours-365">
		<p class="lead-heading lead-heading--sub">
			<span class="lead-heading--mark">●</span>
			<?php esc_html_e( '在宅診療', 'szokhc' ); ?>
			<span style="font-size:14px;color:#000;"><?php esc_html_e( '　（365日対応）', 'szokhc' ); ?></span>
		</p>
		<?php if ( $hc_note ) : ?>
			<div class="hours-365__body"><?php echo wp_kses_post( wpautop( $hc_note ) ); ?></div>
		<?php endif; ?>
		<?php if ( $hc_link ) : ?>
			<p style="text-align:right;margin-top:8px;">
				<a href="<?php echo esc_url( $hc_link ); ?>"><?php esc_html_e( '詳しく見る →', 'szokhc' ); ?></a>
			</p>
		<?php endif; ?>
	</div>
</div>
