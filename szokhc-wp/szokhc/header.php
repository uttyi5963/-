<?php
/**
 * Global header.
 *
 * @package Szokhc
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width,initial-scale=1.0">
	<?php wp_head(); ?>
</head>
<body <?php body_class( is_front_page() ? 'home' : '' ); ?>>
<?php wp_body_open(); ?>

<a class="screen-reader-text" href="#site-main"><?php esc_html_e( '本文へスキップ', 'szokhc' ); ?></a>

<header class="site-header" role="banner">
	<div class="container site-header__inner">
		<div class="site-header__brand">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<?php if ( has_custom_logo() ) : ?>
					<?php the_custom_logo(); ?>
				<?php else : ?>
					<span class="site-header__title">
						<?php echo esc_html( szokhc_mod( 'szokhc_clinic_name', get_bloginfo( 'name' ) ) ); ?>
					</span>
				<?php endif; ?>
			</a>
		</div>
		<div class="site-header__sub">
			<?php
			wp_nav_menu( array(
				'theme_location' => 'utility',
				'container'      => false,
				'depth'          => 1,
				'fallback_cb'    => '__return_empty_string',
				'items_wrap'     => '<ul class="utility-nav">%3$s</ul>',
			) );
			?>
		</div>
	</div>
</header>

<button class="menu-btn" type="button" aria-controls="gnavi" aria-expanded="false" aria-label="<?php esc_attr_e( 'メニューを開く', 'szokhc' ); ?>">
	<span>MENU</span>
</button>

<nav class="gnavi-area" id="gnavi" aria-label="<?php esc_attr_e( 'グローバルナビ', 'szokhc' ); ?>">
	<?php
	wp_nav_menu( array(
		'theme_location' => 'global',
		'container'      => false,
		'depth'          => 1,
		'fallback_cb'    => false,
	) );
	?>
</nav>

<main id="site-main" class="site-main">
