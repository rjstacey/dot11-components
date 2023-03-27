import React from 'react';
import {ButtonGroup} from '../form';
import TableViewSelector from './TableViewSelector';
import TableColumnSelector from './TableColumnSelector';
import {SplitPanelButton} from './SplitPanel';

import type { ColumnProperties } from './AppTable';
import type { AppTableDataSelectors, AppTableDataActions } from '../store/appTableData';

type SplitTableButtonGroupProps = {
	columns: Array<ColumnProperties>;
	selectors: AppTableDataSelectors;
	actions: AppTableDataActions;
}

export function SplitTableButtonGroup({columns, selectors, actions}: SplitTableButtonGroupProps) {
	return (
		<ButtonGroup>
			<div>Table view</div>
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<TableViewSelector selectors={selectors} actions={actions} />
				<TableColumnSelector columns={columns} selectors={selectors} actions={actions} />
				<SplitPanelButton selectors={selectors} actions={actions} />
			</div>
		</ButtonGroup>
	)
}

export default SplitTableButtonGroup;
