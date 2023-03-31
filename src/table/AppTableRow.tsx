import React from 'react';
import {areEqual} from 'react-window';
import styled from '@emotion/styled';

import type { EntityId, Dictionary, GetEntityField, ColumnProperties, RowGetterProps, CellRendererProps } from './AppTable';

const OuterRow = styled.div`
	overflow: hidden;
	box-sizing: border-box;
`;

const InnerRow = styled.div`
	display: flex;
	position: relative;
	box-sizing: unset;
	width: 100%;
	height: fit-content;
`;

/**
 * TableRow component for AppTable
 */

type PureTableRowProps = {
	style: {top?: number | string, width?: number | string, height?: number | string};
	gutterSize: number;
	rowIndex: number;
	rowId: EntityId;
	rowData: { [k: string]: unknown };
	isSelected: boolean;
	isExpanded: boolean;
	fixed: boolean;
	columns: ColumnProperties[];
	getField: GetEntityField<{}>;
	estimatedRowHeight: number;
	onRowHeightChange: (rowIndex: number, height: number) => void;
	onClick?: (event: React.MouseEvent) => void;
};

function PureTableRow({
	style,
	gutterSize,
	rowIndex,
	rowId,
	rowData,
	isSelected,
	isExpanded,
	fixed,
	columns,
	getField,
	estimatedRowHeight,
	onRowHeightChange,
	onClick,
}: PureTableRowProps) {
	const rowRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		//if (!rowRef.current)
		//	return;
		const height = isExpanded? rowRef.current!.getBoundingClientRect().height: estimatedRowHeight;
		if (style.height !== height)
			onRowHeightChange(rowIndex, height);
	}, [rowIndex, isExpanded, estimatedRowHeight, columns, fixed, onRowHeightChange, style.height, style.width]);

	const cells = React.useMemo(() => columns.map(column => {
		const {cellRenderer, dataRenderer, width, flexGrow, flexShrink, key: dataKey} = column;
		const style = {
			flexBasis: width,
			flexGrow: fixed? 0: flexGrow,
			flexShrink: fixed? 0: flexShrink,
			overflow: 'hidden'	// necessary to ensure that the content does not affect width
		}
		const renderer = cellRenderer ||
			(dataRenderer
				? ({rowData, dataKey}) => dataRenderer(getField(rowData, dataKey))
				: ({rowData, dataKey}) => getField(rowData, dataKey));
		const props: CellRendererProps = {rowIndex, rowId, rowData, dataKey};
		return (
			<div
				key={dataKey}
				className='AppTable__dataCell'
				style={style}
			>
				{renderer(props)}
			</div>
		)
	}), [columns, fixed, rowIndex, rowId, rowData, getField]);

	// Add appropriate row classNames
	let classNames = ['AppTable__dataRow'];
	classNames.push((rowIndex % 2 === 0)? 'AppTable__dataRow-even': 'AppTable__dataRow-odd');
	if (isSelected)
		classNames.push('AppTable__dataRow-selected');

	if (typeof style.top === 'number' && typeof style.height === 'number')
		style = {...style, top: style.top + gutterSize, height: style.height - gutterSize};	// Adjust style for gutter

	return (
		<OuterRow
			style={style}
			className={classNames.join(' ')}
			onClick={onClick}
		>
			<InnerRow
				ref={rowRef}
			>
				{cells}
			</InnerRow>
		</OuterRow>
	)
}

// Memoize so that a row is only re-rendered if the row specific data changes
const TableRow = React.memo(PureTableRow, areEqual);

export type AppTableRowData = {
	gutterSize: number;
	entities: Dictionary<unknown>,
	ids: EntityId[];
	selected: EntityId[];
	expanded: EntityId[];
	fixed: boolean;
	columns: ColumnProperties[];
	getRowData?: (props: RowGetterProps) => any;
	getField: GetEntityField<{}>;
	estimatedRowHeight: number;
	measureRowHeight: boolean;
	onRowHeightChange: (rowIndex: number, height: number) => void;
	onRowClick: ({event, rowIndex}: {event: React.MouseEvent, rowIndex: number}) => void;
};

type AppTableRowProps = {
	rowIndex: number;
	style: {top?: number | string, width?: number | string, height?: number | string};
	data: AppTableRowData;
};

function AppTableRow({rowIndex, style, data}: AppTableRowProps) {

	// Extract context from data prop and isolate the row specific data
	const {entities, ids, selected, expanded, measureRowHeight, getRowData, onRowClick, ...otherProps} = data;

	const rowId = ids[rowIndex];
	const rowData = getRowData 
		? getRowData({rowIndex, rowId, ids, entities})
		: entities[rowId];
		
	const isSelected = selected && selected.includes(rowId);
	const isExpanded = measureRowHeight || (expanded && expanded.includes(rowId));

	const onClick = React.useMemo(() => onRowClick? (event: React.MouseEvent) => onRowClick({event, rowIndex}): undefined, [onRowClick, rowIndex]);

	return (
		<TableRow
			key={rowId}
			style={style}
			rowIndex={rowIndex}
			rowId={rowId}
			rowData={rowData}
			isSelected={isSelected}
			isExpanded={isExpanded}
			onClick={onClick}
			{...otherProps}
		/>
	)
}

export default AppTableRow;
