import * as React from "react";
import Input from "./Input";

const Checkbox = ({
	indeterminate = false,
	...props
}: { indeterminate?: boolean } & React.ComponentProps<typeof Input>) => (
	<Input
		type="checkbox"
		ref={(el) => el && (el.indeterminate = indeterminate)}
		{...props}
	/>
);

export default Checkbox;
