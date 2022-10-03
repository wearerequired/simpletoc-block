/**
 * Get the average of an array of numbers.
 *
 * @param {number[]} array
 *
 * @return {number} average
 */
const average = ( array ) => array.reduce( ( a, b ) => a + b ) / array.length;

/**
 * Get the current scroll distance.
 *
 * @return {number} scrollDistance
 */
const getScrollDistance = () => {
	const { top } = document.body.getBoundingClientRect();
	return Math.abs( top );
};

const getAllLinks = () => {
	const tocList = document.querySelector( '.simpletoc-list' );
	const links = tocList.querySelectorAll( 'a' );

	return links;
};

/**
 * Get all the headings that are linked in the TOC.
 *
 * @return {HTMLElement[]} headings
 */
const getAllHeadings = () => {
	const links = getAllLinks();
	const hrefIds = Array.from( links ).map( ( link ) => link.getAttribute( 'href' ) );

	return hrefIds.map( ( hrefId ) => document.querySelector( hrefId ) );
};

/**
 * Get all the headings positions relative to the top of the body.
 *
 * @param {HTMLElement[]} headings
 *
 * @return {number[]} headingsPositions
 */
const getHeadingsPositions = ( headings ) => {
	return headings.map( ( heading ) => {
		const { top } = heading.getBoundingClientRect();
		return top + document.body.scrollTop;
	} );
};

/**
 * Get the index of the closest heading to the current scroll distance.
 *
 * @param {number[]} headingsPositions
 *
 * @return {number} closestHeadingIndex
 */
const getClosestHeadingIndex = ( headingsPositions ) => {
	const viewportHeight = window.innerHeight * 0.75;

	const index = headingsPositions.findIndex( ( position ) => position <= viewportHeight );

	return index === -1 ? headingsPositions.length - 1 : index;
};

/**
 * Get the total scroll progress.
 *
 * @return {number} totalScrollProgress
 */
const getTotalScrollProgress = () => {
	const scrollDistance = getScrollDistance();
	const totalScrollDistance = document.body.scrollHeight - window.innerHeight;

	return scrollDistance / totalScrollDistance;
};

/**
 * Check if element is in viewport.
 * This checks if it is in the viewport vertically and horizontally.
 *
 * @param {HTMLElement} element
 *
 * @return {boolean} isInViewport
 */
const isInViewport = ( element ) => {
	const rect = element.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= ( window.innerHeight || document.documentElement.clientHeight ) &&
		rect.right <= ( window.innerWidth || document.documentElement.clientWidth )
	);
};

/**
 * Scroll element inside a scrollable container into view.
 *
 * @param {HTMLElement}               element
 * @param {HTMLElement}               container
 * @param {'vertical' | 'horizontal'} axis
 *
 * @return {void}
 */
const scrollIntoView = ( element, container, axis = 'vertical' ) => {
	const { top, left } = element.getBoundingClientRect();
	const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

	const scrollLeft = left - containerLeft + container.scrollLeft;
	const scrollTop = top - containerTop + container.scrollTop;

	if ( axis === 'vertical' ) {
		container.scrollTo( { top: scrollTop, behavior: 'smooth' } );
	} else {
		container.scrollTo( { left: scrollLeft, behavior: 'smooth' } );
	}
};

const scrollTracking = async () => {
	// Wait for 1s to make sure the headings are rendered.
	await new Promise( ( resolve ) => setTimeout( resolve, 1000 ) );

	const tocListContainer = document.querySelector( '.simpletoc-list > ul, simpletoc-list > ol' );

	// Get all links from the TOC.
	const links = getAllLinks();
	// Get all the headings in the TOC in reverse order.
	const headings = getAllHeadings().reverse();
	const MAX_PROGRESS = headings.length - 1;

	// Add event listeners
	window.addEventListener( 'scroll', () => {
		const updatedHeadingsPositions = getHeadingsPositions( headings );

		const closestHeadingIndex = getClosestHeadingIndex( updatedHeadingsPositions );

		const closestHeading = headings[ closestHeadingIndex ];

		// Make current heading with the .current class
		links.forEach( ( link ) => {
			link.classList.remove( 'current' );
		} );

		const closestHeadingLink = document.querySelector(
			`a[href="#${ closestHeading.getAttribute( 'id' ) }"]`
		);

		// Check if closestHeadingLink is in the viewport
		if ( ! isInViewport( closestHeadingLink ) ) {
			scrollIntoView( closestHeadingLink, tocListContainer, 'horizontal' );
		}

		closestHeadingLink.classList.add( 'current' );

		const totalScrollProgress = getTotalScrollProgress().toFixed( 3 ) * 100;

		// Get the progress of the closesHeadingIndex to the MAX_PROGRESS
		const progress = 100 - ( closestHeadingIndex / MAX_PROGRESS ) * 100;

		const averageProgess = average( [ progress, totalScrollProgress ] );

		// Set the progress bar progress to a CSS variable
		const progressBar = document.querySelector( '.simpletoc-list .progress-bar-indicator' );
		progressBar.style.setProperty( '--progress', averageProgess + '%' );
	} );
};

window.addEventListener( 'load', scrollTracking );
