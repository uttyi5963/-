<?php
/**
 * Single page template.
 *
 * @package Szokhc
 */

get_header();
?>

<div class="container section">
	<?php while ( have_posts() ) : the_post(); ?>
		<article <?php post_class( 'page-entry' ); ?>>
			<header class="page-entry__head">
				<h1 class="page-entry__title"><?php the_title(); ?></h1>
			</header>
			<div class="page-entry__body">
				<?php the_content(); ?>
			</div>
		</article>
	<?php endwhile; ?>
</div>

<?php
get_footer();
