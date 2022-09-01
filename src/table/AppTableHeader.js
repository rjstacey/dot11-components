import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

import ColumnResizer from './ColumnResizer';

const HeaderCell = styled.div`
	display: flex;
`;

const HeaderCellContent = styled.div`
	height: 100%;
	width: calc(100% - 12px)
`;

const HeaderAnchor = styled.div`
	position: relative;
`;

const HeaderContainer = styled.div`
	overflow: hidden;
`;

const HeaderRow = styled.div`
	display: flex;
	height: 100%;
`;

/**
 * TableHeader component for AppTable
 *
 * HeaderAnchor provides an attachment point (outside the 'overflow: hidden') for dropdown overlays
 * HeaderContainer is the viewport for HeaderRow; same width as the data table row
 * HeaderRow is the full header and may exceed the viewport width; scolled by the data table horizontal scroll bar
 * A HeaderCell is present for each column and contains the header cell content and column resizer
 */
 const TableHeader = React.forwardRef(({
	className,
	outerStyle,
	innerStyle,
	fixed,
	columns,
	setColumnWidth,
	defaultHeaderCellRenderer}, ref) => {

	const anchorRef = React.useRef(null);
	const [cells, setCells] = React.useState(null);

	React.useEffect(() => {
		// After mount, update header cells: the anchor ref is now available
		const cells = columns.map((column) => {
			const {headerRenderer, width, flexGrow, flexShrink, key: dataKey, ...colProps} = column;
			const style = {
				flexBasis: width,
				flexGrow: fixed? 0: flexGrow,
				flexShrink: fixed? 0: flexShrink,
				overflow: 'hidden'	// necessary so that the content does not affect size
			};
			const renderer = headerRenderer || defaultHeaderCellRenderer;
			const props = {anchorEl: anchorRef.current, dataKey, column, ...colProps};
			return (
				<HeaderCell
					key={dataKey}
					className='AppTable__headerCell'
					style={style}
				>
					<HeaderCellContent>
						{renderer(props)}
					</HeaderCellContent>
					<ColumnResizer
						onDrag={(event, {deltaX}) => setColumnWidth(dataKey, deltaX)}
					/>
				</HeaderCell>
			)
		});
		setCells(cells);
	}, [columns, fixed, defaultHeaderCellRenderer, setColumnWidth]);

	const classNames = [className, 'AppTable__headerRow'].join(' ')

	return (
		<HeaderAnchor ref={anchorRef}>
			<HeaderContainer
			 	ref={ref}
			 	className='AppTable__headerContainer'
				style={outerStyle}
			>
				<HeaderRow
					className={classNames}
					style={innerStyle}
				>
					{cells}
				</HeaderRow>
			</HeaderContainer>
		</HeaderAnchor>
	)
})

TableHeader.propTypes = {
	className: PropTypes.string,
	outerStyle: PropTypes.object,
	innerStyle: PropTypes.object,
	fixed: PropTypes.bool,
	columns: PropTypes.array.isRequired,
	setColumnWidth: PropTypes.func.isRequired,
	defaultHeaderCellRenderer: PropTypes.func,
}

export default TableHeader
