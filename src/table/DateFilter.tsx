import { useDispatch, useSelector } from "react-redux";
import { Input, Row, Field } from "../form";
import {
	FilterComp,
	AppTableDataSelectors,
	AppTableDataActions,
	CompOp,
} from "../store/appTableData";

export function DateFilter({
	dataKey,
	selectors,
	actions,
}: {
	dataKey: string;
	selectors: AppTableDataSelectors;
	actions: AppTableDataActions;
}) {
	const dispatch = useDispatch();

	const beforeDate = useSelector((state: any) => {
		const filter = selectors.selectFilter(state, dataKey);
		return filter.comps.find((c) => c.operation === CompOp.LT)?.value || "";
	});

	const afterDate = useSelector((state: any) => {
		const filter = selectors.selectFilter(state, dataKey);
		return filter.comps.find((c) => c.operation === CompOp.GT)?.value || "";
	});

	const setBefore = (date: string) => {
		const comps: FilterComp[] = date
			? [{ value: date, operation: CompOp.LT }]
			: [];
		dispatch(actions.setFilter({ dataKey, comps }));
	};

	const setAfter = (date: string) => {
		const comps: FilterComp[] = date
			? [{ value: date, operation: CompOp.GT }]
			: [];
		dispatch(actions.setFilter({ dataKey, comps }));
	};

	return (
		<>
			<Row>
				<Field label="Before:">
					<Input
						type="date"
						value={beforeDate}
						onChange={(e) => setBefore(e.target.value)}
					/>
				</Field>
			</Row>
			<Row>
				<Field label="After:">
					<Input
						type="date"
						value={afterDate}
						onChange={(e) => setAfter(e.target.value)}
					/>
				</Field>
			</Row>
		</>
	);
}
