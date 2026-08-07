import { FC, memo } from 'react';
import { Outlet } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { PageLoader } from 'widgets/page-loader';
import { MessageBar } from 'widgets/message-bar';
import { ScrollToTop } from 'shared/ui/pages';
import { MainLayoutWrapper } from './wrapper';
import { Navbar } from 'widgets/navbar';
import { Footer } from 'widgets/footer';
import { UIConfigurator } from 'widgets/ui-configurator';
import { HintsContainer as Hints } from 'widgets/hints';



export const MainLayout: FC = memo(() => (
  <MainLayoutWrapper>
    <CssBaseline />
    <MessageBar />
    <PageLoader />
    <ScrollToTop />
    <Navbar />
    <UIConfigurator />

    <Outlet />
    <Footer />
    <Hints />
  </MainLayoutWrapper>
));
