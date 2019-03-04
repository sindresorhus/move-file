export interface Options {
	/**
	 * Overwrite existing destination file.
	 *
	 * @default true
	 */
	readonly overwrite?: boolean;
}

/**
 * Move a file.
 *
 * @param source - File you want to move.
 * @param destination - Where you want the file moved.
 * @returns A `Promise` that resolves when the file has been moved.
 */
export default function moveFile(
	source: string,
	destination: string,
	options?: Options
): Promise<void>;

/**
 * Move a file synchronously.
 *
 * @param source - File you want to move.
 * @param destination - Where you want the file moved.
 */
export function sync(
	source: string,
	destination: string,
	options?: Options
): void;
