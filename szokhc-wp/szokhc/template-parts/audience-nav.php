<?php
/**
 * Audience selector (patient / hospital / facility).
 *
 * 「患者・ご家族の方へ」「病院関係者の方へ」「施設関係者の方へ」など
 * 対象者別の入口を並べる。リンク先はWP管理画面のメニュー
 * (audience location) で運用する。
 *
 * @package Szokhc
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! has_nav_menu( 'audience' ) ) { return; }
?>
<section class="section audience">
	<div class="container">
		<h2 class="section__title"><?php esc_html_e( '対象別ご案内', 'szokhc' ); ?></h2>
		<nav class="audience__nav card-grid" aria-label="<?php esc_attr_e( '対象別ナビ', 'szokhc' ); ?>">
			<?php
			wp_nav_menu( array(
				'theme_location' => 'audience',
				'container'      => false,
				'items_wrap'     => '%3$s',
				'walker'         => new Szokhc_Audience_Walker(),
				'depth'          => 1,
			) );
			?>
		</nav>
	</div>
</section>
<?php
/**
 * Walker that renders each item as a card.
 */
if ( ! class_exists( 'Szokhc_Audience_Walker' ) ) {
	class Szokhc_Audience_Walker extends Walker_Nav_Menu {
		public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
			$desc = $item->description ? '<p class="card__lead">' . esc_html( $item->description ) . '</p>' : '';
			$output .= sprintf(
				'<a class="card" href="%s"><h3 class="card__title">%s</h3>%s</a>',
				esc_url( $item->url ),
				esc_html( $item->title ),
				$desc
			);
		}
		public function end_el( &$output, $item, $depth = 0, $args = null ) {}
	}
}
