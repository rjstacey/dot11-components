import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { EntityId } from "@reduxjs/toolkit";

import { ActionIcon } from "../icons";
import { parseNumber } from "../lib";
import { TextArea } from "../form";
import {
	AppTableDataSelectors,
	AppTableDataActions,
	FilterComp,
	CompOp,
	FieldType,
} from "../store/appTableData";

import styles from "./IdList.module.css";

const idRegex = /[^\s,]+/g; // /\d+\.\d+|\d+/g

function IdList({
	style,
	className,
	ids,
	isValid,
	isNumber,
	onChange,
	focusOnMount,
}: {
	style?: React.CSSProperties;
	className?: string;
	ids: EntityId[];
	isValid: (id: EntityId) => boolean;
	isNumber: boolean;
	onChange: (ids: EntityId[]) => void;
	focusOnMount?: boolean;
}) {
	const inputRef = React.useRef<HTMLTextAreaElement>(null);
	const mirrorRef = React.useRef<HTMLDivElement>(null);
	const [value, setValue] = React.useState(() => ids.join(", "));
	const [mirrorHtml, setMirrorHtml] = React.useState(value);

	React.useEffect(() => {
		const inputEl = inputRef.current!;
		const mirrorEl = mirrorRef.current!;

		const inputStyles = window.getComputedStyle(inputEl);
		[
			"border",
			"boxSizing",
			"fontFamily",
			"fontSize",
			"fontWeight",
			"letterSpacing",
			"lineHeight",
			"padding",
			"textDecoration",
			"textIndent",
			"textTransform",
			"whiteSpace",
			"wordSpacing",
			"wordWrap",
		].forEach((property) => {
			mirrorEl.style[property] = inputStyles[property];
		});
		mirrorEl.style.borderColor = "transparent";

		const parseValue = (v: string) =>
			v.endsWith("px") ? parseInt(v.slice(0, -2), 10) : 0;
		const borderWidth = parseValue(inputStyles.borderWidth);

		const ro = new ResizeObserver(() => {
			mirrorEl.style.width = `${inputEl.clientWidth + 2 * borderWidth}px`;
			mirrorEl.style.height = `${
				inputEl.clientHeight + 2 * borderWidth
			}px`;
		});
		ro.observe(inputEl);

		inputEl.addEventListener("scroll", () => {
			mirrorEl.scrollTop = inputEl.scrollTop;
			mirrorEl.scrollLeft = inputEl.scrollLeft;
		});
	}, []);

	React.useEffect(() => {
		if (focusOnMount) {
			const inputEl = inputRef.current!;
			inputEl.focus();
			inputEl.selectionStart = inputEl.value.length;
		}
	}, [focusOnMount]);

	function markInvalid(value: string) {
		return value.replace(idRegex, (match) => {
			const id = isNumber ? parseNumber(match) : match;
			return isValid(id) ? match : `<mark>${match}</mark>`;
		});
	}

	function handleChange(value: string) {
		setValue(value);

		// Update mirror HTML, marking all the invalid ids
		setMirrorHtml(markInvalid(value));

		let updatedIds: EntityId[] = value.match(idRegex) || [];
		if (isNumber) updatedIds = updatedIds.map(parseNumber);
		if (updatedIds.join() !== ids.join()) onChange(updatedIds);
	}

	return (
		<div
			className={styles.main + (className ? " " + className : "")}
			style={style}
		>
			<div
				ref={mirrorRef}
				className="mirror"
				dangerouslySetInnerHTML={{ __html: mirrorHtml }}
			/>
			<TextArea
				ref={inputRef}
				className="input"
				value={value}
				onChange={(e) => handleChange(e.target.value)}
				placeholder="Enter list..."
			/>
			<ActionIcon
				style={{visibility: value? 'visible': 'hidden'}}
				className="clear"
				type="clear"
				onClick={() => handleChange("")}
			/>
		</div>
	);
}

export function IdFilter({
	selectors,
	actions,
	dataKey = "id",
	...props
}: {
	dataKey?: string;
	style?: React.CSSProperties;
	className?: string;
	focusOnMount?: boolean;
	selectors: AppTableDataSelectors;
	actions: AppTableDataActions;
}) {
	const dispatch = useDispatch();
	const { getField } = selectors;
	const ids = useSelector(selectors.selectIds);
	const entities = useSelector(selectors.selectEntities);
	//const isNumber = ids.length > 0 && typeof getField(entities[ids[0]], dataKey) === "number";

	const selectFilter = React.useCallback((state: any) => selectors.selectFilter(state, dataKey), [selectors, dataKey]);
	const filter = useSelector(selectFilter);
	const isNumber = filter.type === FieldType.NUMERIC;
	const values = filter.comps.map((v) => v.value);

	const isValid = React.useCallback(
		(value: any) =>
			ids.findIndex(
				(id) => getField(entities[id], dataKey) === value
			) !== -1,
		[ids, entities, dataKey, getField]
	);

	const onChange = React.useCallback(
		(values: EntityId[]) => {
			const comps: FilterComp[] = values.map((value: EntityId) => ({
				value,
				operation: CompOp.EQ,
			}));
			dispatch(actions.setFilter({ dataKey, comps }));
		},
		[dispatch, actions, dataKey]
	);

	return (
		<IdList
			ids={values}
			onChange={onChange}
			isValid={isValid}
			isNumber={isNumber}
			{...props}
		/>
	);
}

export function IdSelector({
	dataKey = "id",
	selectors,
	actions,
	...props
}: {
	dataKey?: string;
	selectors: AppTableDataSelectors;
	actions: AppTableDataActions;
	style?: React.CSSProperties;
	className?: string;
	focusOnMount?: boolean;
}) {
	const dispatch = useDispatch();
	const { getField } = selectors;
	const ids = useSelector(selectors.selectIds);
	const entities = useSelector(selectors.selectEntities);
	const selected = useSelector(selectors.selectSelected);
	const values = selected.map((id) => getField(entities[id]!, dataKey));
	const isNumber = ids.length > 0 && typeof getField(entities[ids[0]], dataKey) === "number";

	const isValid = React.useCallback(
		(value: EntityId) =>
			ids.findIndex(
				(id) => getField(entities[id], dataKey) === value
			) !== -1,
		[ids, entities, dataKey, getField]
	);

	const onChange = React.useCallback(
		(values: EntityId[]) => {
			const selected = values.reduce(
				(selected: EntityId[], value: EntityId) => {
					const i = ids.findIndex(
						(id) => getField(entities[id]!, dataKey) === value
					);
					if (i !== -1) selected.push(ids[i]);
					return selected;
				},
				[]
			);
			dispatch(actions.setSelected(selected));
		},
		[dispatch, actions, dataKey, ids, entities, getField]
	);

	return (
		<IdList
			ids={values}
			onChange={onChange}
			isValid={isValid}
			isNumber={isNumber}
			{...props}
		/>
	);
}
