import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faFileUpload,
	faFileDownload,
	faFileExport,
	faFileImport,
	faHighlighter,
	faBold,
	faItalic,
	faStrikethrough,
	faUnderline,
	faUndo,
	faRedo,
	faQuoteRight,
	faListUl,
	faListOl,
	faCode,
	faSync,
	faPlus,
	faTrashAlt,
	faSortAlphaDown,
	faSortAlphaUp,
	faSortNumericDown,
	faSortNumericUp,
	faFilter,
	faWindowClose,
	faAngleDoubleDown,
	faArrowCircleRight,
	faArrowCircleLeft, //faArrowCircleUp, faArrowCircleDown,
	//faPlusSquare, faMinusSquare,
	faColumns,
	faSave,
	faObjectGroup,
	faEdit,
	//faCaretSquareDown, faCaretSquareUp,
	faHistory,
	faUserSlash,
	faUserCheck,
	faUser,
	faUsersSlash,
	faUsers,
	faBookOpen,
	faAngleRight,
	faAngleLeft,
	faLink,
	faBan,
	faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
	faPlusSquare,
	faMinusSquare,
	faCopy,
	faCalendar,
} from "@fortawesome/free-regular-svg-icons";

import "bootstrap-icons/font/bootstrap-icons.css";

export function IconSort({ direction, isAlpha, ...props }) {
	const icon =
		direction === "ASC"
			? isAlpha
				? faSortAlphaDown
				: faSortNumericDown
			: isAlpha
			? faSortAlphaUp
			: faSortNumericUp;
	return <FontAwesomeIcon icon={icon} {...props} />;
}

export const IconFilter = (props) => (
	<FontAwesomeIcon icon={faFilter} {...props} />
);

export const IconCollapse = ({ isCollapsed, ...props }) => (
	<FontAwesomeIcon
		icon={isCollapsed ? faPlusSquare : faMinusSquare}
		{...props}
	/>
);

const IconSVG = styled.svg`
	display: inline-block;
	height: 1em;
`;

const IconHandle = ({ isOpen, style, ...otherProps }) => (
	<IconSVG
		style={isOpen ? style : { ...style, transform: "rotate(180deg)" }}
		{...otherProps}
		fill="currentColor"
		viewBox="0 0 40 40"
	>
		<path d="M31 26.4q0 .3-.2.5l-1.1 1.2q-.3.2-.6.2t-.5-.2l-8.7-8.8-8.8 8.8q-.2.2-.5.2t-.5-.2l-1.2-1.2q-.2-.2-.2-.5t.2-.5l10.4-10.4q.3-.2.6-.2t.5.2l10.4 10.4q.2.2.2.5z" />
	</IconSVG>
);

const IconClear = (props) => (
	<IconSVG {...props} fill="currentColor" viewBox="0 0 40 40">
		<path
			d="M 10 10 L 30 30 M 10 30 L 30 10"
			stroke="currentColor"
			strokeWidth="4"
		/>
	</IconSVG>
);
//const IconClear: React.FC = (props) => <span {...props}>×</span>

const IconExpander = ({ open, style, ...otherProps }) => (
	<IconSVG
		style={open ? { ...style, transform: "rotate(90deg)" } : style}
		{...otherProps}
		fill="currentColor"
		viewBox="0 0 40 40"
	>
		<path
			d="M 10 10 L 10 30 L 20 20 Z"
			stroke="currentColor"
			strokeWidth="4"
		/>
	</IconSVG>
);

const IconDoubleExpander = ({ open, style, ...otherProps }) => (
	<IconSVG
		style={open ? { ...style, transform: "rotate(90deg)" } : style}
		{...otherProps}
		fill="currentColor"
		viewBox="0 0 40 40"
	>
		<path
			d="M 10 10 L 10 30 L 20 20 Z M 20 10 L 20 30 L 30 20 Z"
			stroke="currentColor"
			strokeWidth="4"
		/>
	</IconSVG>
);

const IconVoteYes = ({ style, ...otherProps }) => (
	<IconSVG
		style={{ ...style, transform: "translate(0, 3px)" }}
		{...otherProps}
		viewBox="0 0 600 600"
	>
		<path
			d="M 7.6885391,404.6142 C 7.6885391,404.6142 122.85389,534.30185 145.88696,587.27791 L 244.92916,587.27791 C 286.38869,460.59602 447.62018,158.16034 585.8186,52.208207 C 614.45182,15.394067 542.5208,0.19798715 484.4731,24.568517 C 396.98668,61.298507 231.98485,341.73657 201.16633,409.22081 C 157.4035,420.73735 111.33735,335.51499 111.33735,335.51499 L 7.6885391,404.6142 z "
			style={{ fill: "#00bb00" }}
		/>
	</IconSVG>
);

const IconVoteNo = ({ style, ...otherProps }) => (
	<IconSVG
		style={{ ...style, transform: "translate(0, 3px)" }}
		{...otherProps}
		viewBox="0 0 525 600"
	>
		<path
			d="M 15.554399,499.23617 C 15.554399,489.88388 49.262003,442.92493 90.460178,394.88295 C 131.65835,346.84096 171.36188,300.19332 178.69024,291.22150 C 186.01860,282.24967 178.40699,230.17136 161.77557,175.49190 C 127.32187,62.217924 124.18126,24.551078 147.96473,9.8520875 C 180.47155,-10.238240 225.08409,19.441293 262.53181,86.070496 L 300.46929,153.57113 L 371.71241,83.651323 C 418.55713,37.676699 451.99662,17.200896 469.35551,23.862122 C 503.70070,37.041618 523.52158,88.613119 497.56689,97.264679 C 468.10720,107.08456 346.17818,292.63354 346.40950,327.29275 C 346.51902,343.70450 363.84370,387.26650 384.90880,424.09720 C 399.76671,450.07512 419.73824,470.57451 411.81016,484.66521 L 369.43018,559.98778 C 361.21065,574.59648 330.85012,535.64770 294.88494,497.84045 L 232.14649,431.88864 L 162.59445,514.37325 C 124.34083,559.73979 88.627185,596.62407 83.230792,596.33832 C 77.834411,596.05256 15.554399,508.58848 15.554399,499.23617 z "
			style={{ fill: "#bb0000" }}
		/>
	</IconSVG>
);

const IconPeopleSlash = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">

<path d="
  M15 14
  s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1
  h8Zm-7.978-1
  A.261.261 0 0 1 7 12.996
  c.001-.264.167-1.03.76-1.72
  C8.312 10.629 9.282 10 11 10
  c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002
  a.274.274 0 0 1-.014.002
  H7.022Z
  M11 7
  a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z
  m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z
  M6.936 9.28a5.88 5.88 0 0 0-1.23-.247
  A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1
  h4.216A2.238 2.238 0 0 1 5 13
  c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z
  " />
  <path d="M14 2 L1 15" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M14 2 L1 15" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
</svg>
)

export const faIcons = {
	//refresh: faSync,
	//add: faPlus,
	//delete: faTrashAlt,
	//next: faArrowCircleRight,
	//prev: faArrowCircleLeft,
	//import: faFileImport,
	//export: faFileExport,
	//upload: faFileUpload,
	//download: faFileDownload,
	//more: faAngleDoubleDown,
	//columns: faColumns,
	//save: faSave,
	//undo: faUndo,
	//redo: faRedo,
	//close: faWindowClose,
	"object-group": faObjectGroup,
	//edit: faEdit,
	//"book-open": faBookOpen,
	//history: faHistory,
	//copy: faCopy,
	//"user-slash": faUserSlash,
	//"user-check": faUserCheck,
	//user: faUser,
	//"group-slash": faUsersSlash,
	//group: faUsers,
	"angle-right": faAngleRight,
	"angle-left": faAngleLeft,
	//calendar: faCalendar,
	//filter: faFilter,
	//link: faLink,
	//cancel: faBan,
	//envelope: faEnvelope,

	/* editing: inline styles */
	//bold: faBold,
	//italic: faItalic,
	//underline: faUnderline,
	//strikethrough: faStrikethrough,
	//highlight: faHighlighter,

	/* editing: block styles */
	//quote: faQuoteRight,
	//"unordered-list-item": faListUl,
	//"ordered-list-item": faListOl,
	//code: faCode,
};

export const otherIcons = {
	clear: IconClear,
	handle: <i className="bi-chevron-down" />, //IconHandle,
	expander: IconExpander,
	"double-expander": IconDoubleExpander,
	sort: IconSort,
	"vote-yes": IconVoteYes,
	"vote-no": IconVoteNo,

	"refresh": <i className="bi-arrow-repeat" />,
	"undo": <i className="bi-arrow-counterclockwise" />,
	"redo": <i className="bi-arrow-clockwise" />,
	"copy": <i className="bi-copy" />,
	"edit": <i className="bi-pencil" />,
	"cancel": <i className="bi-x-circle" />,
	"ok": <i className="bi-check-circle" />,
	"next": <i className="bi-arrow-right-circle" />,
	"prev": <i className="bi-arrow-left-circle" />,
	"filter": <i className="bi-funnel" />,
	"add-item": <i className="bi-journal-plus" />,
	"close": <i className="bi-x-square" />,

	"add": <i className="bi-plus-lg" />,
	"delete": <i className="bi-trash" />,
	//"clear": <i className="bi-x-lg" />,

	"book-open": <i className="bi-book" />,

	"user": <i className="bi-person" />,
	"user-check": <i className="bi-person-check" />,
	"user-slash": <i className="bi-person-slash" />,
	"group": <i className="bi-people" />,
	"group-slash": <IconPeopleSlash />,

	"envelope": <i className="bi-envelope" />,
	"send": <i className="bi-send" />,
	"calendar": <i className="bi-calendar" />,
	"columns": <i className="bi-layout-three-columns" />,
	"save": <i className="bi-floppy" />,
	"history": <i className="bi-clock-history" />,

	"import": <i className="bi-cloud-upload" />,
	"export": <i className="bi-cloud-download" />,
	"upload": <i className="bi-upload" />,
	"download": <i className="bi-download" />,
	"more": <i className="bi-chevron-double-down" />,

	/* editing: inline styles */
	"bold": <i className="bi-type-bold" />,
	"italic": <i className="bi-type-italic" />,
	"underline": <i className="bi-type-underline" />,
	"strikethrough": <i className="bi-type-strikethrough" />,
	"highlight": <i className="bi-highlighter" />,
	"link": <i className="bi-link" />,

	/* editing: block styles */
	"quote": <i className="bi-blockquote-left" />,
	"unordered-list-item": <i className="bi-list-ul" />,
	"ordered-list-item": <i className="bi-list-ol" />,
	"code": <i className="bi-code" />,

	"text-left": <i className="bi-text-left" />,
	"text-right": <i className="bi-text-right" />,
	"text-center": <i className="bi-text-center" />,
	"text-justify": <i className="bi-justify" />,
	"text-indent-left": <i className="bi-text-indent-left" />,
	"text-indent-right": <i className="bi-text-indent-right" />,
};

export const availableIcons = Object.keys(faIcons).concat(
	Object.keys(otherIcons)
);

type IconProps = {
	type?: string;
	name?: string;
	[key: string]: any;
};

export const Icon = ({ type, name, ...rest }: IconProps) => {
	let icon: any;
	if (type) icon = faIcons[type];
	if (name) icon = faIcons[name];
	if (icon) return <FontAwesomeIcon icon={icon} {...rest} />;
	if (type) icon = otherIcons[type];
	if (icon) {
		if (React.isValidElement(icon)) {
			const className = ((icon as React.ReactElement<{className?: string}>).props.className || "")
				+ (rest.className? " " + rest.className: "");
			return React.cloneElement(icon, {...rest, className} as any);
		}
		return typeof icon === "function"
			? icon(rest)
			: icon;
	}
	console.warn("Unknown icon: ", type || name);
	return null;
};

interface _ActionIconProps extends IconProps {
	disabled?: boolean;
	onClick?: (e: MouseEvent) => void;
}

const _ActionIcon = ({ disabled, onClick, ...rest }: _ActionIconProps) => (
	<Icon
		disabled={disabled}
		onClick={disabled ? undefined : onClick}
		{...rest}
	/>
);

export const ActionIcon = styled(_ActionIcon)`
	:hover:not([disabled]) {
		cursor: pointer;
		color: tomato;
	}
`;

/*
 * Spinner from https://loading.io/css/
 */
const SpinnerWrap = styled.div`
	display: inline-flex;
	position: relative;
	width: 80px;
	height: 22px;
	align-items: center;
	& div {
		position: absolute;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #aaa;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}
	& div:nth-of-type(1) {
		left: 8px;
		animation: lds-ellipsis1 0.6s infinite;
	}
	& div:nth-of-type(2) {
		left: 8px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	& div:nth-of-type(3) {
		left: 32px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	& div:nth-of-type(4) {
		left: 56px;
		animation: lds-ellipsis3 0.6s infinite;
	}
	@keyframes lds-ellipsis1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes lds-ellipsis3 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}
	@keyframes lds-ellipsis2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(24px, 0);
		}
	}
`;

export const Spinner = (props) => (
	<SpinnerWrap {...props}>
		<div></div>
		<div></div>
		<div></div>
		<div></div>
	</SpinnerWrap>
);
