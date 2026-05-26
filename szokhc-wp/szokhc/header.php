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
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link screen-reader-text" href="#site-main"><?php esc_html_e( 'メインコンテンツへスキップ', 'szokhc' ); ?></a>

<header class="site-header" role="banner">
	<div class="container site-header__inner">
		<div class="site-header__brand">
			<?php if ( function_exists( 'the_custom_logo' ) && has_custom_logo() ) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-header__title">
					<?php echo esc_html( szokhc_mod( 'szokhc_clinic_name', get_bloginfo( 'name' ) ) ); ?>
				</a>
			<?php endif; ?>
		</div>

		<nav class="site-header__nav" aria-label="<?php esc_attr_e( 'グローバルナビ', 'szokhc' ); ?>">
			<?php
			wp_nav_menu( array(
				'theme_location' => 'global',
				'container'      => false,
				'depth'          => 2,
				'fallback_cb'    => false,
			) );
			?>
		</nav>

		<div class="site-header__cta">
			<?php echo szokhc_tel_link(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
	</div>
</header>

<main id="site-main" class="site-main">
