<?php
/**
 * Search form.
 *
 * @package Szokhc
 */
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="screen-reader-text" for="s"><?php esc_html_e( 'サイト内検索', 'szokhc' ); ?></label>
	<input type="search" id="s" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="<?php esc_attr_e( 'キーワードで検索', 'szokhc' ); ?>">
	<button type="submit"><?php esc_html_e( '検索', 'szokhc' ); ?></button>
</form>
