import React from "react";
import { Meta, Story } from "@storybook/react";
import { Dropdown, ActionButtonDropdown } from "../dropdown";
import { Select } from "../form";

type Option = {
	value: number;
	label: string;
};

const options: Option[] = [
	{ value: 1, label: "One" },
	{ value: 2, label: "Two" },
	{ value: 3, label: "Three" },
	{ value: 4, label: "Four" },
	{ value: 5, label: "Five" },
	{ value: 6, label: "Six" },
	{ value: 7, label: "Seven" },
	{ value: 8, label: "Eight" },
	{ value: 9, label: "Nine" },
];

type ContentProps = {
	close?: () => void;
	state: State;
	setState: React.Dispatch<React.SetStateAction<State>>;
};

function Content({ close, state, setState }: ContentProps) {
	const changeState = (changes: Partial<State>) =>
		setState((state: typeof defaultState) => ({ ...state, ...changes }));
	return (
		<form style={{ width: "200px" }} onSubmit={(e) => e.preventDefault()}>
			<label>
				<input type="radio" id="1" />
				Fred
			</label>
			<br />
			<label>
				<input type="radio" id="1" />
				Frog
			</label>
			<br />
			<label>
				Text:
				<input
					type="text"
					size={24}
					value={state.text}
					onChange={(e) => changeState({ text: e.target.value })}
				/>
			</label>
			<label>
				Select:
				<Select
					values={state.selectValues}
					onChange={(selectValues: Option[]) =>
						changeState({ selectValues })
					}
					options={options}
					dropdownHeight={150}
				/>
			</label>
			<button onClick={() => alert(JSON.stringify(state))}>OK</button>
			<button onClick={close}>Cancel</button>
		</form>
	);
}

type State = {
	text: string;
	selectValues: Option[];
};

const defaultState: State = {
	text: "",
	selectValues: [],
};

function Template({
	usePortal,
	Component,
	...args
}: {
	usePortal?: boolean;
	Component: typeof Dropdown | typeof ActionButtonDropdown;
}) {
	const [state1, setState1] = React.useState<State>(defaultState);
	const [state2, setState2] = React.useState<State>(defaultState);
	const [state3, setState3] = React.useState<State>(defaultState);
	let portal: Element | undefined;
	if (usePortal) portal = document.querySelector("#root") || undefined;
	return (
		<div
			id="main"
			style={{ display: "flex", justifyContent: "space-between" }}
		>
			<Component {...args} portal={portal}>
				<Content state={state1} setState={setState1} />
			</Component>
			<Component {...args} portal={portal}>
				<Content state={state2} setState={setState2} />
			</Component>
			<Component {...args} portal={portal}>
				<Content state={state3} setState={setState3} />
			</Component>
		</div>
	);
}

export const IconButton: Story = (args) => <Template Component={ActionButtonDropdown} {...args} />;
IconButton.args = {
	name: "add",
	title: "Icon button",
	Component: ActionButtonDropdown,
};

export const TextButton: Story = (args) => <Template Component={ActionButtonDropdown} {...args} />;
TextButton.args = {
	label: "Click Me",
	title: "Label button",
	Component: ActionButtonDropdown,
};

export const Label: Story = (args) => <Template Component={Dropdown} {...args} />;
Label.args = {
	label: "Label",
	title: "Add something",
	Component: Dropdown,
};

export default {
	title: "Dropdown",
	component: Dropdown,
	argTypes: {
		usePortal: { type: "boolean" },
		disabled: { type: "boolean" },
	},
} as Meta;
