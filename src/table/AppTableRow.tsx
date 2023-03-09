import React from 'react';
import PropTypes from 'prop-types';
import {areEqual} from 'react-window';
import styled from '@emotion/styled';

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
}) {
	const rowRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		//if (!rowRef.current)
		//	return;
		const height = isExpanded? (rowRef.current as HTMLDivElement).getBoundingClientRect().height: estimatedRowHeight;
		if (style.height !== height)
			onRowHeightChange(rowIndex, height);
	}, [rowIndex, isExpanded, estimatedRowHeight, columns, fixed, onRowHeightChange, style.height, style.width]);

	const cells = React.useMemo(() => columns.map(column => {
		const {headerRenderer, cellRenderer, dataRenderer, width, flexGrow, flexShrink, key: dataKey, ...colProps} = column;
		const style = {
			flexBasis: width,
			flexGrow: fixed? 0: flexGrow,
			flexShrink: fixed? 0: flexShrink,
			overflow: 'hidden'	// necessary to ensure that the content does not affect width
		}
		const getCellData = ({rowData, dataKey}) => rowData.hasOwnProperty(dataKey)? rowData[dataKey]: getField(rowData, dataKey);
		const renderer = cellRenderer ||
			(dataRenderer
				? (props) => dataRenderer(getCellData(props))
				: (props) => getCellData(props));
		const props = {rowIndex, rowId, rowData, dataKey, ...colProps}
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

	return (
		<OuterRow
			style={{...style, top: style.top + gutterSize, height: style.height - gutterSize}}	// Adjust style for gutter
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

PureTableRow.propTypes = {
	style: PropTypes.object.isRequired,
	rowIndex: PropTypes.number.isRequired,
	rowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	rowData: PropTypes.object.isRequired,
	isSelected: PropTypes.bool.isRequired,
	isExpanded: PropTypes.bool.isRequired,
	fixed: PropTypes.bool.isRequired,
	columns: PropTypes.array.isRequired,
	getField: PropTypes.func.isRequired,
	estimatedRowHeight: PropTypes.number.isRequired,
	onRowHeightChange: PropTypes.func.isRequired,
	onClick: PropTypes.func
};

// Memoize so that a row is only re-rendered if the row specific data changes
const TableRow = React.memo(PureTableRow, areEqual);

function AppTableRow({rowIndex, style, data}) {

	// Extract context from data prop and isolate the row specific data
	const {entities, ids, selected, expanded, measureRowHeight, getRowData, onRowClick, ...otherProps} = data;

	const rowId = ids[rowIndex];
	const rowData = getRowData 
		? getRowData({rowIndex, rowId, ids, entities})
		: entities[rowId];
		
	const isSelected = selected && selected.includes(rowId);
	const isExpanded = measureRowHeight || (expanded && expanded.includes(rowId));

	const onClick = React.useMemo(() => onRowClick? event => onRowClick({event, rowIndex}): undefined, [onRowClick, rowIndex]);

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
