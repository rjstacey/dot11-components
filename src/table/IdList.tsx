import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { EntityId } from "@reduxjs/toolkit";

import styled from "@emotion/styled";
import {
	Editor,
	EditorState,
	ContentState,
	CompositeDecorator,
} from "draft-js";
import "draft-js/dist/Draft.css";

import { ActionIcon } from "../icons";
import { parseNumber } from "../lib";
import {
	AppTableDataSelectors,
	AppTableDataActions,
	FilterComp,
	CompOp,
} from "../store/appTableData";

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	.DraftEditor-root {
		width: 100%;
		cursor: text;
	}
	:hover {
		border-color: #0074d9;
	}
`;

const idRegex = /[^\s,]+/g; // /\d+\.\d+|\d+/g

type IdListProps = {
	style?: React.CSSProperties;
	className?: string;
	ids: EntityId[];
	isValid: (id: EntityId) => boolean;
	isNumber: boolean;
	onChange: (ids: EntityId[]) => void;
	focusOnMount?: boolean;
};

function IdList({
	style,
	className,
	ids,
	isValid,
	isNumber,
	onChange,
	focusOnMount,
}: IdListProps) {
	const editorRef = React.useRef<Editor>(null);
	const [editorState, setEditorState] =
		React.useState<EditorState>(initState);

	/*React.useEffect(() => {
		// Close the dropdown if the user scrolls
		// (we don't track position changes during scrolling)
		window.addEventListener('scroll', close, true);
		return () => window.removeEventListener('scroll', close);
	}, [close])*/

	React.useEffect(() => {
		if (!editorState.getSelection().getHasFocus()) {
			let state = EditorState.push(
				editorState,
				ContentState.createFromText(ids.join(", ")),
				"remove-range"
			);
			state = EditorState.moveSelectionToEnd(state);
			setEditorState(state);
		}
	}, [ids]);

	function initState() {
		const decorator = new CompositeDecorator([
			{
				strategy: findInvalidIds,
				component: (props) => (
					<span style={{ color: "red" }}>{props.children}</span>
				),
			},
		]);
		let state = EditorState.createWithContent(
			ContentState.createFromText(ids.join(", ")),
			decorator
		);
		if (focusOnMount) state = EditorState.moveFocusToEnd(state);
		return state;
	}

	function findInvalidIds(contentBlock, callback, contentState) {
		const text = contentBlock.getText();
		let matchArr: RegExpExecArray | null, start: number;
		while ((matchArr = idRegex.exec(text)) !== null) {
			start = matchArr.index;
			const id = isNumber ? parseNumber(matchArr[0]) : matchArr[0];
			if (!isValid(id)) callback(start, start + matchArr[0].length);
		}
	}

	function clear(e: MouseEvent) {
		e.stopPropagation(); // don't take focus from editor

		//setEditorState(EditorState.push(editorState, ContentState.createFromText('')))
		/*let contentState = editorState.getCurrentContent();
		const firstBlock = contentState.getFirstBlock();
		const lastBlock = contentState.getLastBlock();
		const allSelected = new SelectionState({
			anchorKey: firstBlock.getKey(),
			anchorOffset: 0,
			focusKey: lastBlock.getKey(),
			focusOffset: lastBlock.getLength(),
			hasFocus: true
		});
		contentState = Modifier.removeRange(contentState, allSelected, 'backward');
		const state = EditorState.push(editorState, contentState, 'remove-range');
		setEditorState(state);*/
		onChange([]);
	}

	function emitChange(state: EditorState) {
		const s = state.getCurrentContent().getPlainText();
		let updatedIds: Array<EntityId> = s.match(idRegex) || [];
		if (isNumber) updatedIds = updatedIds.map((id) => parseNumber(id));
		if (updatedIds.join() !== ids.join()) onChange(updatedIds);
		return null;
	}

	/*function handleKeyCommand(command) {
		if (command === 'enter') {
			// Perform a request to save your contents, set
			// a new `editorState`, etc.
			return 'handled';
		}
		return 'not-handled';
	}*/

	return (
		<Container
			style={style}
			className={className}
			onClick={(e) => editorRef.current && editorRef.current.focus()}
		>
			<Editor
				ref={editorRef}
				editorState={editorState}
				onChange={setEditorState}
				handleReturn={() => emitChange(editorState) || "handled"} // return 'handled' to prevent default handler
				onBlur={() => emitChange(editorState)}
				placeholder={"Enter list..."}
			/>
			{editorState.getCurrentContent().hasText() && (
				<ActionIcon type="clear" onClick={clear} />
			)}
		</Container>
	);
}

type IdFilterProps = {
	dataKey?: string;
	style?: React.CSSProperties;
	className?: string;
	focusOnMount?: boolean;
	selectors: AppTableDataSelectors;
	actions: AppTableDataActions;
};

export function IdFilter({
	selectors,
	actions,
	dataKey = "id",
	...props
}: IdFilterProps) {
	const dispatch = useDispatch();

	const { getField } = selectors;

	const selectInfo = React.useCallback(
		(state: any) => {
			const ids = selectors.selectIds(state);
			const entities = selectors.selectEntities(state);
			const filter = selectors.selectFilter(state, dataKey);
			return {
				values: filter.comps.map((v) => v.value) || [],
				isNumber:
					ids.length > 0 &&
					typeof getField(entities[ids[0]]!, dataKey) === "number",
				ids,
				entities,
			};
		},
		[selectors, getField, dataKey]
	);

	const { values, isNumber, ids, entities } = useSelector(selectInfo);

	const isValid = React.useCallback(
		(value: any) =>
			ids.findIndex(
				(id) => getField(entities[id]!, dataKey) === value
			) !== -1,
		[ids, entities, dataKey, getField]
	);

	const onChange = React.useCallback(
		(values: any) => {
			const comps: FilterComp[] = values.map((value: any) => ({
				value,
				type: CompOp.EQ,
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

type IdSelectorProps = {
	dataKey?: string;
	style?: React.CSSProperties;
	className?: string;
	focusOnMount?: boolean;
	selectors: AppTableDataSelectors;
	actions: AppTableDataActions;
};

export function IdSelector({
	selectors,
	actions,
	dataKey = "id",
	...props
}: IdSelectorProps) {
	const dispatch = useDispatch();
	const { getField } = selectors;

	const selectInfo = React.useCallback(
		(state: any) => {
			const ids = selectors.selectIds(state);
			const entities = selectors.selectEntities(state);
			const selected = selectors.selectSelected(state);
			return {
				values: selected.map((id) => getField(entities[id]!, dataKey)),
				isNumber:
					ids.length > 0 &&
					typeof getField(entities[ids[0]]!, dataKey) === "number",
				ids,
				entities,
			};
		},
		[selectors, getField, dataKey]
	);

	const { values, isNumber, ids, entities } = useSelector(selectInfo);

	const isValid = React.useCallback(
		(value: EntityId) =>
			ids.findIndex(
				(id) => getField(entities[id]!, dataKey) === value
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
