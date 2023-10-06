import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Row, Field } from '../form';
import {
	type FilterComp,
	AppTableDataSelectors,
	AppTableDataActions
} from '../store/appTableData';

type DateFilterProps = {
	dataKey: string;
	selectors: AppTableDataSelectors;
	actions: AppTableDataActions
};

export function DateFilter({dataKey, selectors, actions}: DateFilterProps) {

	const dispatch = useDispatch();

	const {beforeDate, afterDate} = useSelector((state: any) => {
        const filter = selectors.selectFilter(state, dataKey);
        const beforeDate = filter.comps.find(c => c.operation === "LT")?.value || '';
        const afterDate = filter.comps.find(c => c.operation === "GT")?.value || '';
        return {beforeDate, afterDate}
    });

    const setBefore = (date: string) => {
        const comps: FilterComp[] = date? [{value: date, operation: "LT"}]: [];
		dispatch(actions.setFilter({dataKey, comps}));
    }

    const setAfter = (date: string) => {
        const comps: FilterComp[] = date? [{value: date, operation: "GT"}]: [];
		dispatch(actions.setFilter({dataKey, comps}));
    }

	return (
        <>
            <Row>
                <Field label='Before:'>
                    <Input
                        type='date'
                        value={beforeDate}
                        onChange={e => setBefore(e.target.value)}
                    />
                </Field>
            </Row>
            <Row>
                <Field label='After:'>
                    <Input
                        type='date'
                        value={afterDate}
                        onChange={e => setAfter(e.target.value)}
                    />
                </Field>
            </Row>
        </>
	)
}
