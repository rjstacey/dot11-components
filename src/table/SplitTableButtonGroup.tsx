import React from 'react';
import {ButtonGroup} from '../form';
import TableViewSelector from './TableViewSelector';
import TableColumnSelector from './TableColumnSelector';
import {SplitPanelButton} from './SplitPanel';

import type {ColumnProperties} from './AppTable';

type SplitTableButtonGroupProps = {
	dataSet: string;
	columns: Array<ColumnProperties>;
}

export function SplitTableButtonGroup({dataSet, columns}: SplitTableButtonGroupProps) {
	return (
		<ButtonGroup>
			<div>Table view</div>
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<TableViewSelector dataSet={dataSet} />
				<TableColumnSelector dataSet={dataSet} columns={columns} />
				<SplitPanelButton dataSet={dataSet} />
			</div>
		</ButtonGroup>
	)
}

export default SplitTableButtonGroup;
