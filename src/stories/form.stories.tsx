import React from "react";
import { ActionButtonDropdown } from "../dropdown";
import {
	Form,
	Field,
	Row,
	Col,
	List,
	ListItem,
	Select,
	Input,
	TextArea,
	Checkbox,
	InputDates,
	InputTime,
	SliderSwitch,
} from "../form";

const story = {
	title: "Form",
	component: Form,
	argTypes: {
		title: { type: "string" },
		errorText: { type: "string" },
		submitLabel: "Submit Me",
		cancelLabel: "Cancel Me",
		busy: { type: "boolean" },
		submit: { action: "submit" },
		cancel: { action: "cancel" },
		disabled: { type: "boolean" },
		hasActionButtons: { type: "boolean" },
	},
	args: {
		disabled: false,
		busy: false,
		title: "Some sort of title",
		errorText: "Something wrong",
		hasActionButtons: false
	},
};

export const EmptyForm = ({hasActionButtons, ...args}: {hasActionButtons: boolean} & React.ComponentProps<typeof Form>) => {
	let actionButtons: JSX.Element | undefined;
	if (hasActionButtons) {
		actionButtons = (
			<div style={{display: 'flex'}}>
				<i className="bi-pencil" />
				<i className="bi-copy" />
			</div>
		)

	}
	console.log(actionButtons)
	return (
		<Form actionButtons={actionButtons} {...args} />
	)
};

const options = [
	{ label: "One", value: 1 },
	{ label: "Two", value: 2 },
];

export const TwoColsForm = ({
	disabled,
	hasActionButtons,
	...otherArgs
}: { disabled: boolean, hasActionButtons: boolean } & React.ComponentProps<typeof Form>) => {
	const [dates, setDates] = React.useState<Array<string>>([]);
	const [time, setTime] = React.useState("");
	const [checkbox, setCheckbox] = React.useState(false);
	const [select, setSelect] = React.useState<any[]>([]);
	const [slider, setSlider] = React.useState(false);

	let actionButtons: JSX.Element | undefined;
	if (hasActionButtons) {
		actionButtons = (
			<div style={{display: 'flex'}}>
				<i className="bi-add" />
				<i className="bi-edit" />
			</div>
		)

	}
	return (
		<Form
			actionButtons={actionButtons}
			{...otherArgs}
		>
			<Row>
				<Col>
					<List label="List 1:">
						<ListItem>
							<Field label={"Search:"}>
								<Input type="search" disabled={disabled} />
							</Field>
						</ListItem>
						<ListItem>
							<Field label={"Text:"}>
								<Input type="text" disabled={disabled} />
							</Field>
						</ListItem>
						<ListItem>
							<Field label={"Text area:"}>
								<TextArea disabled={disabled} />
							</Field>
						</ListItem>
						<ListItem>
							<Field label={"Date:"}>
								<Input type="date" disabled={disabled} />
							</Field>
						</ListItem>
						<ListItem>
							<Field label={"Dates (multi entry, dual month):"}>
								<InputDates
									multi
									dual
									disablePast
									disabled={disabled}
									value={dates}
									onChange={setDates}
								/>
							</Field>
						</ListItem>
						<ListItem>
							<Field label={"Date:"}>
								<InputDates
									disablePast
									disabled={disabled}
									value={dates.slice(0, 1)}
									onChange={(value) =>
										setDates(value.concat(dates.slice(1)))
									}
								/>
							</Field>
						</ListItem>
						<ListItem>
							<Field label={"Time:"}>
								<InputTime
									disabled={disabled}
									value={time}
									onChange={setTime}
								/>
							</Field>
						</ListItem>
						<ListItem>
							<Field label="Checkbox:">
								<Checkbox
									checked={checkbox}
									disabled={disabled}
									onChange={(e) =>
										setCheckbox(e.target.checked)
									}
								/>
							</Field>
						</ListItem>
						<ListItem>
							<Field label="SliderSwitch:">
								<SliderSwitch
									value={slider}
									onChange={setSlider}
									disabled={disabled}
								/>
							</Field>
						</ListItem>
						<ListItem>
							<Field label={"Search:"}>
								<Input type="search" disabled={disabled} />
							</Field>
						</ListItem>
						<ListItem>
							<Field label={"Select:"}>
								<Select
									readOnly={disabled}
									options={options}
									values={select}
									onChange={setSelect}
								/>
							</Field>
						</ListItem>
						<ListItem>
							<Field label={"Select (portal):"}>
								<Select
									readOnly={disabled}
									options={options}
									values={select}
									onChange={setSelect}
									portal={document.querySelector("#root")}
								/>
							</Field>
						</ListItem>
					</List>
				</Col>
				<Col>
					<List label="List 2:">
						<ListItem>Item one...</ListItem>
						<ListItem>Item two...</ListItem>
						<ListItem>Item three...</ListItem>
					</List>
				</Col>
			</Row>
			<Row>Row two...</Row>
			<Row>Row three...</Row>
		</Form>
	);
};

export const ActionButtonForm = () => {
	const [text, setText] = React.useState("");

	const submitForm = () => alert(`Sending "${text}`);

	return (
		<ActionButtonDropdown
			label="Submit something"
			style={{ width: "fit-content" }}
		>
			<Form title="Submit something" submit={submitForm}>
				<Row>Dropdown form</Row>
				<Row>
					<Field label="Something:">
						<Input
							type="text"
							size={24}
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
					</Field>
				</Row>
			</Form>
		</ActionButtonDropdown>
	);
};

export default story;
