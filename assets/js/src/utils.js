/**
 * WordPress dependencies
 */
import {
	__experimentalUseInnerBlocksProps, // eslint-disable-line -- Stable in WordPress 5.9.
	useInnerBlocksProps as stableUseInnerBlocksProps,
} from '@wordpress/block-editor';

// useInnerBlocksProps became stable in WordPress 5.9.
export const useInnerBlocksProps = __experimentalUseInnerBlocksProps || stableUseInnerBlocksProps;
