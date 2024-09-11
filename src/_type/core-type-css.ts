/*-------------------------------------------------------

                     Css 相关
-------------------------------------------------------*/
export type FlexAlignment =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'stretch'
  | 'space-around'
  | 'space-between';
export type CssItemAlignment = 'start' | 'end' | 'center' | 'stretch';
export type CssContentAlignment =
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';
export type CssGridAutoFlow =
  | 'row'
  | 'column'
  | 'dense'
  | 'row dense'
  | 'column dense';
export type CssGridLayout = Partial<{
  // Track
  gridTemplateColumns: string;
  gridTemplateRows: string;
  /*
  [
    "header header header header",
    "main   main   .      sidebar",
    "footer footer footer footer",
  ]
   */
  gridTemplateAreas: string;
  // Gap
  gridColumnGap: string;
  gridRowGap: string;
  // <grid-row-gap> <grid-column-gap>
  gap: string;
  // Alignment
  justifyItems: CssItemAlignment;
  alignItems: CssItemAlignment;
  justifyContent: CssContentAlignment;
  alignContent: string;
  // Extends
  gridAutoColumns: string;
  gridAutoRows: string;
  gridAutoFlow: CssGridAutoFlow;
}>;

export type CssGridItem = Partial<{
  // <grid-column-start> <grid-column-end>
  gridColumn: string;
  // <number> | <name> | span <number> | auto
  gridColumnStart: string;
  // <number> | <name> | span <number> | auto
  gridColumnEnd: string;
  // <grid-row-start> <grid-row-end>
  gridRow: string;
  // <number> | <name> | span <number> | auto
  gridRowStart: string;
  // <number> | <name> | span <number> | auto
  gridRowEnd: string;
  // <name> | <row-start> / <column-start> / <row-end> / <column-end>
  gridArea: string;
  justifySelf: CssItemAlignment;
  alignSelf: CssItemAlignment;
}>;

export type CssAlignment = 'left' | 'right' | 'center';
export type CssTextAlign =
  | 'left'
  | 'right'
  | 'center'
  | 'start'
  | 'end'
  | 'justify';

export type CssBorderStyle = 'solid' | 'dashed' | 'dotted';

export type CssObjectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
