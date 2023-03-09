import React from 'react';
import styled from '@emotion/styled';

import ColumnResizer from './ColumnResizer';

import type { ColumnParams, ColumnProperties, HeaderRendererProps } from './AppTable';

//const HeaderCell = styled.div`
//	display: flex;
//`;

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

type HeaderCellProps = {
	anchorEl: HTMLElement | null;
	column: ColumnParams & ColumnProperties;
	fixed: boolean;
	adjustColumnWidth: (key: string, deltaX: number) => void;
	defaultHeaderCellRenderer: (props: HeaderRendererProps) => JSX.Element;
};

function HeaderCell({anchorEl, column, fixed, adjustColumnWidth, defaultHeaderCellRenderer}: HeaderCellProps) {
	const {key: dataKey, width, flexGrow, flexShrink, headerRenderer, ...colProps} = column;
	const style = {
		display: 'flex',
		flexBasis: width,
		flexGrow: fixed? 0: flexGrow,
		flexShrink: fixed? 0: flexShrink,
		overflow: 'hidden'	// necessary so that the content does not affect size
	};
	const renderer = headerRenderer || defaultHeaderCellRenderer;
	const props = {anchorEl, dataKey, column, ...colProps};
	const onDrag = (event, {deltaX}) => adjustColumnWidth(dataKey, deltaX);
	return (
		<div
			className='AppTable__headerCell'
			style={style}
		>
			<HeaderCellContent>
				{renderer(props)}
			</HeaderCellContent>
			<ColumnResizer
				onDrag={onDrag}
			/>
		</div>
	)
}

/**
 * TableHeader component for AppTable
 *
 * HeaderAnchor provides an attachment point (outside the 'overflow: hidden') for dropdown overlays
 * HeaderContainer is the viewport for HeaderRow; same width as the data table row
 * HeaderRow is the full header and may exceed the viewport width; scolled by the data table horizontal scroll bar
 * A HeaderCell is present for each column and contains the header cell content and column resizer
 */
type TableHeaderProps = {
	className?: string;
	outerStyle?: React.CSSProperties;
	innerStyle?: React.CSSProperties;
	fixed: boolean;
	columns: Array<ColumnParams & ColumnProperties>;
} & Pick<HeaderCellProps, "adjustColumnWidth" | "defaultHeaderCellRenderer">;

 const TableHeader = React.forwardRef<HTMLDivElement, TableHeaderProps>(({
	className,
	outerStyle,
	innerStyle,
	fixed,
	columns,
	adjustColumnWidth,
	defaultHeaderCellRenderer}, ref) => {

	const anchorRef = React.useRef<HTMLDivElement>(null);
	const [cells, setCells] = React.useState<Array<JSX.Element> | null>(null);

	React.useEffect(() => {
		// After mount, update header cells: the anchor ref is now available
		const cells = columns.map((column) =>
			<HeaderCell
				key={column.key}
				anchorEl={anchorRef.current}
				column={column}
				fixed={fixed}
				adjustColumnWidth={adjustColumnWidth}
				defaultHeaderCellRenderer={defaultHeaderCellRenderer}
			/>
		);

			/*{
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
		});*/
		setCells(cells);
	}, [columns, fixed, defaultHeaderCellRenderer, adjustColumnWidth]);

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

export default TableHeader
