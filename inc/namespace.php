<?php
/**
 * Namespaced functions.
 */

namespace Required\Blocks\SimpleTOC;

use function Required\Traduttore_Registry\add_project;

/**
 * Inits plugin.
 */

function bootstrap(): void {
	// wp_set_script_translations( 'simpletoc-toc-editor-script', 'simpletoc' );
	add_action( 'init', __NAMESPACE__ . '\register_translations_project' );
	add_action( 'init', __NAMESPACE__ . '\register_assets' );
	add_action( 'init', __NAMESPACE__ . '\register_block_types' );
	add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_block_assets' );
}

/**
 * Registers Traduttore project for translations.
 */
function register_translations_project(): void {
	add_project(
		'plugin',
		'simpletoc-block',
		'https://translate.required.com/api/translations/required/simpletoc-block/'
	);
}

/**
 * Registers scripts and styles used by blocks.
 */
function register_assets(): void {
	$blocks_script_asset = require PLUGIN_DIR . '/assets/js/dist/blocks.asset.php';

	wp_register_script(
		'simpletoc-block-editor',
		plugins_url( 'assets/js/dist/blocks.js', PLUGIN_FILE ),
		$blocks_script_asset['dependencies'],
		$blocks_script_asset['version'],
		true
	);

	wp_set_script_translations( 'simpletoc-block-blocks-editor', 'simpletoc-block' );

	$scrolling_slider_block_script_asset = require PLUGIN_DIR . '/assets/js/dist/block-simpletoc.asset.php';
	wp_register_script(
		'simpletoc-block-simpletoc',
		plugins_url( 'assets/js/dist/block-simpletoc.js', PLUGIN_FILE ),
		$scrolling_slider_block_script_asset['dependencies'],
		$scrolling_slider_block_script_asset['version'],
		true
	);

	wp_register_style(
		'simpletoc-block-editor',
		plugins_url( 'assets/js/dist/blocks.css', PLUGIN_FILE ),
		[],
		filemtime( PLUGIN_DIR . '/assets/js/dist/blocks.css' )
	);

	wp_register_style(
		'simpletoc-block-style',
		plugins_url( 'assets/js/dist/style-blocks.css', PLUGIN_FILE ),
		[],
		filemtime( PLUGIN_DIR . '/assets/js/dist/style-blocks.css' )
	);
}


/**
 * Enqueue block scripts only on frontend for pages with the scrolling slider block.
 */
function enqueue_block_assets(): void {
	if ( is_admin() ) {
		return;
	}

	$id = get_the_ID();
	if ( has_block( 'wearerequired/simpletoc-block', $id ) ) {
		wp_enqueue_script( 'simpletoc-block-simpletoc' );
	}
}

/**
 * Registers block types.
 */
function register_block_types(): void {
	register_block_type_from_metadata(
		PLUGIN_DIR . '/assets/js/src/blocks/simpletoc',
		[
			'editor_script'   => 'simpletoc-block-editor',
			'editor_style'    => 'simpletoc-block-editor',
			'style'           => 'simpletoc-block-style',
			'render_callback' => __NAMESPACE__ . '\render_callback',
		]
	);
}

/**
 * Inject potentially missing translations into the block-editor i18n
 * collection.
 *
 * This keeps the plugin backwards compatible, in case the user did not
 * update translations on their website (yet).
 *
 * @param string|false|null $translations JSON-encoded translation data. Default null.
 * @param string|false      $file         Path to the translation file to load. False if there isn't one.
 * @param string            $handle       Name of the script to register a translation domain to.
 * @param string            $domain       The text domain.
 *
 * @return string|false|null JSON string
 */
add_filter( 'load_script_translations', function($translations, $file, $handle, $domain) {
	if ( 'simpletoc' === $domain && $translations ) {
		// List of translations that we inject into the block-editor JS.
		$dynamic_translations = [
			'Table of Contents' => __( 'Table of Contents', 'simpletoc' ),
		];

		$changed = false;
		$obj = json_decode( $translations, true );

		// Confirm that the translation JSON is valid.
		if ( isset( $obj['locale_data'] ) && isset( $obj['locale_data']['messages'] ) ) {
			$messages = $obj['locale_data']['messages'];

			// Inject dynamic translations, when needed.
			foreach ( $dynamic_translations as $key => $locale ) {
				if (
					empty( $messages[ $key ] )
					|| ! \is_array( $messages[$key] )
					|| ! \array_key_exists( 0, $messages[ $key ] )
					|| $locale !== $messages[ $key ][0]
				) {
					$messages[ $key ] = [ $locale ];
					$changed = true;
				}
			}

			// Only modify the translations string when locales did change.
			if ( $changed ) {
				$obj['locale_data']['messages'] = $messages;
				$translations = wp_json_encode( $obj );
			}
		}
	}

	return $translations;
}, 10, 4 );

/**
 * Sets the default value of translatable attributes.
 * 
 * Values inside block.json are static strings that are not translated. This
 * filter inserts relevant translations i
 *
 * @param array $settings Array of determined settings for registering a block type.
 * @param array $metadata Metadata provided for registering a block type.
 *
 * @return array Modified settings array.
 */
add_filter( 'block_type_metadata_settings', function( $settings, $metadata ) {
	if ( 'wearerequired/simpletoc-block' === $metadata['name'] ) {
		$settings['attributes']['title_text']['default'] = __( 'Table of Contents', 'simpletoc' );
	}

	return $settings;
}, 10, 2);

/**
 * Filter to add plugins to the TOC list for Rank Math plugin
 *
 * @param array TOC plugins.
 */

add_filter('rank_math/researches/toc_plugins', function ($toc_plugins) {
	$toc_plugins['simpletoc-block/plugin.php'] = 'SimpleTOC';
	return $toc_plugins;
});

function simpletoc_addIDstoContent( $content ): string {

	$blocks = parse_blocks( $content );

	$blocks = addIDstoBlocks_recursive( $blocks );

	$content = serialize_blocks( $blocks );

	return $content;
}

add_filter( 'the_content', __NAMESPACE__ . '\simpletoc_addIDstoContent', 1 );


function addIDstoBlocks_recursive( $blocks ) {

	foreach ( $blocks as &$block ) {
		if (isset($block['blockName']) && ( $block['blockName'] === 'core/heading' || $block['blockName'] === 'generateblocks/headline') && isset($block['innerHTML']) && isset($block['innerContent']) && isset($block['innerContent'][0]) ){
				$block['innerHTML'] = addAnchorAttribute($block['innerHTML']);
				$block['innerContent'][0] = addAnchorAttribute($block['innerContent'][0]);
		} else if ( isset($block['attrs']['ref']) ){
				// search in reusable blocks (this is not finished because I ran out of ideas.)
				// $reusable_block_id = $block['attrs']['ref'];
				// $reusable_block_content = parse_blocks(get_post($reusable_block_id)->post_content);
		} else if ( ! empty( $block['innerBlocks'] ) ) {
				// search in groups
				$block['innerBlocks'] = addIDstoBlocks_recursive( $block['innerBlocks'] );
		}
	}

	return $blocks;
}

/**
 * Render block output
 *
 */

function render_callback( $attributes )
{

	$is_backend = \defined('REST_REQUEST') && true === REST_REQUEST && 'edit' === filter_input(INPUT_GET, 'context');

	$title_text = esc_html( trim( $attributes['title_text'] ) );
	if ( ! $title_text ) {
		$title_text = __('Table of Contents', 'simpletoc');
	}

	$alignclass = '';
	if ( isset ($attributes['align']) ) {
		$align = $attributes['align'];
		$alignclass = 'align' . $align;
	}

	$className = '';
	if ( isset( $attributes['className'] ) ) {
		$className = strip_tags(htmlspecialchars($attributes['className'] ));
	}

	$pre_html = '';
	$post_html = '';
	if ( $className != '' ) {
		$pre_html = '<div class="simpletoc ' . $className . '">';
		$post_html = '</div>';
	}

	$post = get_post();
	if ( \is_null($post) || \is_null($post->post_content) ) {
		$blocks = '';
	} else {
		$blocks = parse_blocks($post->post_content);
	}

	if ( empty($blocks) ) {
		$html = '';
		if( $is_backend == true ) {
			if ($attributes['no_title'] == false) {
				$html = '<h2 class="simpletoc-title ' . $alignclass . '">' . $title_text . '</h2>';
			}

			$html .= '<p class="components-notice is-warning ' . $alignclass . '">' . __('No blocks found.', 'simpletoc')  . ' ' . __('Save or update post first.', 'simpletoc') . '</p>';
		}
		return $html;
	}

	$headings = array_reverse(filter_headings_recursive($blocks));

	// enrich headings with pages as a data-attribute
	$headings = simpletoc_add_pagenumber($blocks, $headings);

	$headings_clean = array_map('trim', $headings);

	if ( empty( $headings_clean ) ) {
		$html = '';
		if( $is_backend == true ) {

			if ($attributes['no_title'] == false) {
				$html = '<h2 class="simpletoc-title ' . $alignclass . '">' . $title_text . '</h2>';
			}

			$html .= '<p class="components-notice is-warning ' . $alignclass . '">' . __('No headings found.', 'simpletoc') . ' ' . __('Save or update post first.', 'simpletoc') . '</p>';
		}
		return $html;
	}

	$toclist = generateToc($headings_clean, $attributes);

	if ( empty( $toclist ) ) {
		$html = '';
		if( $is_backend == true ) {

			if ($attributes['no_title'] == false) {
				$html = '<h2 class="simpletoc-title ' . $alignclass . '">' . $title_text . '</h2>';
			}

			$html .= '<p class="components-notice is-warning ' . $alignclass . '">' . __('No headings found.', 'simpletoc') . ' ' . __('Check minimal and maximum level block settings.', 'simpletoc') . '</p>';
		}
		return $html;

	}

	$output = $pre_html . $toclist . $post_html;

	return $output;
}


function simpletoc_add_pagenumber( $blocks, $headings ){
	$pages = 1;

	foreach ($blocks as $block => $innerBlock) {

		// count nextpage blocks
		if (isset($blocks[$block]['blockName']) && $blocks[$block]['blockName'] === 'core/nextpage' ){
			$pages++;
		}

		if (isset($blocks[$block]['blockName']) && $blocks[$block]["blockName"] === 'core/heading') {
			// make sure its a headline.
			foreach ($headings as $heading => &$innerHeading){
				if($innerHeading == $blocks[$block]["innerHTML"]){
					$innerHeading = preg_replace("/(<h1|<h2|<h3|<h4|<h5|<h6)/i", '$1 data-page="' . $pages . '"', $blocks[$block]["innerHTML"]);
				}
			}
		}
	}
	return $headings;
}

/**
 * Return all headings with a recursive walk through all blocks.
 * This includes groups and reusable block with groups within reusable blocks.
 */

function filter_headings_recursive( $blocks )
{
	$arr = array();

	foreach ($blocks as $block => $innerBlock) {

		if (\is_array($innerBlock)) {

			if (isset($innerBlock['attrs']['ref'])) {
				// search in reusable blocks
				$e_arr = parse_blocks(get_post($innerBlock['attrs']['ref'])->post_content);
				$arr = array_merge(filter_headings_recursive($e_arr), $arr);
			} else {
				// search in groups
				$arr = array_merge(filter_headings_recursive($innerBlock), $arr);
			}
		} else {

			if (isset($blocks['blockName']) && ( $blocks['blockName'] === 'core/heading' ) && $innerBlock !== 'core/heading') {
				// make sure its a headline.
				if (preg_match("/(<h1|<h2|<h3|<h4|<h5|<h6)/i", $innerBlock)) {
					$arr[] = $innerBlock;
				}
			}

			if (isset($blocks['blockName']) && ( $blocks['blockName'] === 'generateblocks/headline' ) && $innerBlock !== 'core/heading') {
				// make sure its a headline.
				if (preg_match("/(<h1|<h2|<h3|<h4|<h5|<h6)/i", $innerBlock)) {
					$arr[] = $innerBlock;
				}
			}
		}
	}

	return $arr;

}

/**
 * Remove all problematic characters for toc links
 */

function simpletoc_sanitize_string( $string )
{
	// remove punctuation
	$zero_punctuation = preg_replace("/\p{P}/u", "", $string);
	// remove non-breaking spaces
	$html_wo_nbs = str_replace("&nbsp;", " ", $zero_punctuation);
	// remove umlauts and accents
	$string_without_accents = remove_accents($html_wo_nbs);
	// Sanitizes a title, replacing whitespace and a few other characters with dashes.
	$sanitized_string = sanitize_title_with_dashes($string_without_accents);
	// Encode for use in an url
	$urlencoded = urlencode($sanitized_string);
	return $urlencoded;
}

function addAnchorAttribute( $html )
{

	// remove non-breaking space entites from input HTML
	$html_wo_nbs = str_replace("&nbsp;", " ", $html);

	// Thank you Nick Diego
	if (!$html_wo_nbs) {
		return $html;
	}

	libxml_use_internal_errors(TRUE);
	$dom = new \DOMDocument();
	@$dom->loadHTML($html_wo_nbs, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

	// use xpath to select the Heading html tags.
	$xpath = new \DOMXPath($dom);
	$tags = $xpath->evaluate("//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]");

	// Loop through all the found tags
	foreach ($tags as $tag) {
		// if tag already has an attribute "id" defined, no need for creating a new one
		if (!empty($tag->getAttribute('id'))) {continue;}
		// Set id attribute
		$heading_text = strip_tags($html);
		$anchor = simpletoc_sanitize_string($heading_text);
		$tag->setAttribute("id", $anchor);
	}

	// Save the HTML changes
	$content = utf8_decode($dom->saveHTML($dom->documentElement));

	return $content;
}

function generateToc( $headings, $attributes )
{

	$list = '';
	$html = '';
	$min_depth = 6;
	$listtype = 'ul';
	$absolute_url = '';
	$inital_depth = 6;
	$link_class = '';
	$styles = '';

	$title_text = esc_html( trim( $attributes['title_text'] ) );
	if ( ! $title_text ) {
		$title_text = __('Table of Contents', 'simpletoc');
	}

	$alignclass = '';
	if ( isset ($attributes['align']) ) {
		$align = $attributes['align'];
		$alignclass = 'align' . $align;
	}

	if ($attributes['remove_indent'] == true) {
		$styles = 'style="padding-left:0;list-style:none;"';
	}

	if ($attributes['add_smooth'] == true) {
		$link_class = 'class="smooth-scroll"';
	}

	if ($attributes['use_ol'] == true) {
		$listtype = 'ol';
	}

	if ($attributes['use_absolute_urls'] == true) {
		$absolute_url = get_permalink();
	}

	foreach ($headings as $line => $headline) {
		if ($min_depth > $headings[$line][2]) {
			// search for lowest level
			$min_depth = (int) $headings[$line][2];
			$inital_depth = $min_depth;
		}
	}

	/* If there is a custom min level, make sure it is the baseline. */
	if ($attributes['min_level'] > $min_depth) {
		$min_depth = $attributes['min_level'];
	}

	$itemcount = 0;

	foreach ($headings as $line => $headline) {

		$title = strip_tags($headline);
		$page = '';
		$dom = new \DOMDocument();
		@$dom->loadHTML($headline, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
		$xpath = new \DOMXPath($dom);
		$nodes = $xpath->query('//*/@data-page');

		if ( isset($nodes[0] ) && $nodes[0]->nodeValue > 1) {
			$page = $nodes[0]->nodeValue . '/';
			$absolute_url = get_permalink();
		}

		$link = simpletoc_sanitize_string($title);
		if (isset($nodes[0]) && !empty($nodes[0]->ownerElement->getAttribute('id'))) {
			// if the node already has an attribute id, use that as anchor
			$link = $nodes[0]->ownerElement->getAttribute('id');
		}

		$this_depth = (int) $headings[$line][2];
		if (isset($headings[$line + 1][2])) {
			$next_depth = (int) $headings[$line + 1][2];
		} else {
			$next_depth = '';
		}

		// skip this heading because a max depth is set.
		if ($this_depth > $attributes['max_level'] or strpos($headline, 'class="simpletoc-hidden') > 0) {
			goto closelist;
		}

		// skip this heading because a min depth is set.
		if( $this_depth < $attributes['min_level'] ){
			continue;
		}

		$itemcount++;

		// start list
		if ($this_depth == $min_depth) {
			$list .= "<li>\n";
		} else {
			// we are not as base level. Start opening levels until base is reached.
			for ($min_depth; $min_depth < $this_depth; $min_depth++) {
				$list .= "\n\t\t<" . $listtype . "><li>\n";
			}
		}

		$list .= "<a " . $link_class . " href=\"" . $absolute_url . esc_html($page) . "#" . $link . "\">" . $title . "</a>";

		closelist:
		// close lists
		// check if this is not the last heading
		if ($line != \count($headings) - 1) {
			// do we need to close the door behind us?
			if ($min_depth > $next_depth) {
				// If yes, how many times?
				for ($min_depth; $min_depth > $next_depth; $min_depth--) {
					$list .= "</li></" . $listtype . ">\n";
				}
			}
			if ($min_depth == $next_depth) {
				$list .= "</li>";
			}
			// last heading
		} else {
			for ($inital_depth; $inital_depth < $this_depth; $inital_depth++) {
				$list .= "</li></" . $listtype . ">\n";
			}
		}
	}

	if ($attributes['no_title'] == false) {
		$html = "<h2 class=\"simpletoc-title\">" . $title_text . "</h2>";
	}
	$progress_html = "<div class=\"progress-bar\"><div class=\"progress-bar-indicator\"></div></div>";
	$html .= "<div class=\"simpletoc-list\">" . $progress_html . "<" . $listtype . " " . $styles ."  " . $alignclass .">\n" . $list . "</li></" . $listtype . "></div>";

	if($itemcount < 1) {
		$html = '';
	}

	return $html;
}
