import React from "react";
import styled from "@emotion/styled";

import { monthLabels } from "./utils";

const HeaderContainer = styled.div`
	position: relative;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	width: 100%;
`;

const ArrowButton = styled.button`
	position: absolute;
	height: 100%;
`;

const ArrowLeft = styled(ArrowButton)`
	left: 10px;
	:before {
		content: "←";
	}
`;

const ArrowRight = styled(ArrowButton)`
	right: 10px;
	:after {
		content: "→";
	}
`;

const Label = styled.div`
	display: flex;
	justify-content: center;
`;

type HeaderProps = {
	onClickPrev: (e: React.MouseEvent) => void;
	onClickNext: (e: React.MouseEvent) => void;
	viewDate: { year: number; month: number };
	options: { dual: boolean };
};

function Header({ onClickPrev, onClickNext, viewDate, options }: HeaderProps) {
	const years = [viewDate.year];
	const months = [viewDate.month];
	if (options.dual) {
		const date = new Date(viewDate.year, viewDate.month + 1, 1);
		months.push(date.getMonth());
		if (viewDate.year !== date.getFullYear())
			years.push(date.getFullYear());
	}
	return (
		<HeaderContainer className="calendar_header">
			<ArrowLeft
				className="calendar_arrow calendar_arrow-left"
				onClick={onClickPrev}
			/>
			{years.map((year) => (
				<Label key={year} style={{ width: `${100 / years.length}%` }}>
					{year}
				</Label>
			))}
			{months.map((month) => (
				<Label key={month} style={{ width: `${100 / months.length}%` }}>
					{monthLabels[month]}
				</Label>
			))}
			<ArrowRight
				className="calendar_arrow calendar_arrow-right"
				onClick={onClickNext}
			/>
		</HeaderContainer>
	);
}

export default Header;
