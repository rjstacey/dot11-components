import React from "react";

export default function useClickOutside(
	ref: React.RefObject<HTMLElement>,
	handler: (event: MouseEvent) => void
) {
	React.useEffect(
		() => {
			const listener = (event: MouseEvent) => {
				// Do nothing if clicking ref's element or descendent elements
				if (
					!ref.current ||
					ref.current.contains(event.target as HTMLElement)
				) {
					return;
				}

				handler(event);
			};

			//document.addEventListener('mousedown', listener);
			//document.addEventListener('touchstart', listener);
			document.addEventListener("click", listener);
			//document.addEventListener('scroll', listener, true);

			return () => {
				//document.removeEventListener('mousedown', listener);
				//document.removeEventListener('touchstart', listener);
				document.removeEventListener("click", listener);
				//document.removeEventListener('scroll', listener)
			};
		},
		// Add ref and handler to effect dependencies
		// It's worth noting that because passed in handler is a new ...
		// ... function on every render that will cause this effect ...
		// ... callback/cleanup to run every render. It's not a big deal ...
		// ... but to optimize you can wrap handler in useCallback before ...
		// ... passing it into this hook.
		[ref, handler]
	);
}
