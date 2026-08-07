import { FC, memo } from 'react';
import { SidebarRegulatorWrapper } from 'shared/ui/wrappers';
import { FooterTopLeftColumn as LeftTopColumn } from './left-top-column';
import { FooterLeftBottomColumn as LeftBottomColumn } from './left-bottom-column';
import { FooterTopMiddleColumn as MiddleTopColumn } from './middle-top-column';
import { FooterTopRightColumn as RightTopColumn } from './right-top-column';
import { FooterBottomRightColumn as RightBottomColumn } from './right-bottom-column';
import { FooterRow } from './row';
import { Divider } from 'shared/ui/mui-components';
import { FooterBottomMiddleColumn as BottomMiddleColumn } from './middle-bottom-column';



export const Footer: FC = memo(() => (
  <SidebarRegulatorWrapper>
    <FooterRow height={110}>
      <LeftTopColumn />
      <MiddleTopColumn />
      <RightTopColumn />
    </FooterRow>

    <Divider />

    <FooterRow height={110}>
      <LeftBottomColumn />
      <BottomMiddleColumn />
      <RightBottomColumn />
    </FooterRow>
  </SidebarRegulatorWrapper>
));
