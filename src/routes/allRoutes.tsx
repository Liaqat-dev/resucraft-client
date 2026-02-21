import BasicInput from "@pages/form/basic-input";
import CheckboxRadio from "@pages/form/checkbox-radio";
import Clipboards from "@pages/form/clipboard";
import FileInput from "@pages/form/file-input";
import InputGroup from "@pages/form/input-group";
import InputSpin from "@pages/form/input-spin";
import Pickers from "@pages/form/pickers";
import Range from "@pages/form/range";
import Recaptcha from "@pages/form/recaptcha";
import SelectPage from "@pages/form/select";
import Switches from "@pages/form/switches";
import WizardBasic from "@pages/form/wizard-basic";
import {ReactNode} from "react";
import Accodion from "@pages/ui/accordion";
import Alerts from "@pages/ui/alerts";
import AdvancedEffect from "@pages/ui/advanced3dEffect";
import AdvancedAnimation from "@pages/ui/advancedAnimation";
import Boat from "@pages/ui/advancedBot";
import Highlight from "@pages/ui/advancedHighlight";
import BaseTables from "@pages/table/base";
import BasicTables from "@pages/table/datatables/basic";
import Bordered from "@pages/table/datatables/bordered";
import Stripe from "@pages/table/datatables/stripe";
import Hover from "@pages/table/datatables/hover";
import RowGrouPing from "@pages/table/datatables/rowGrouping";
import Mask from "@pages/ui/advancedMask";
import Simplebar from "@pages/ui/advancedSimplebar";
import SwiperElement from "@pages/ui/advancedSwiper";
import Tree from "@pages/ui/advancedTree";
import WordCounters from "@pages/ui/advancedWordCounter";
import ImageAnnotation from "@pages/ui/advancedImageAnnotation";
import Badge from "@pages/ui/badge";
import BreadCrumbs from "@pages/ui/breadCrumb";
import ButtonsGroup from "@pages/ui/buttonsGroup";
import Button from "@pages/ui/buttons";
import ButtonNavigation from "@pages/ui/buttonNavigation";
import Cards from "@pages/ui/cards";
import Colors from "@pages/ui/colors";
import Cookies from "@pages/ui/cookie";
import Drawer from "@pages/ui/drawer";
import Dropdowns from "@pages/ui/dropdown";
import Gallerys from "@pages/ui/gallery";
import Links from "@pages/ui/links";
import ListGroups from "@pages/ui/listGroup";
import Loader from "@pages/ui/loader";
import Modals from "@pages/ui/modal";
import Notifications from "@pages/ui/notification";
import Paginations from "@pages/ui/pagination";
import ProgressBars from "@pages/ui/progressBar";
import Tabs from "@pages/ui/tabs";
import TimeLine from "@pages/ui/timeLine";
import Tooltips from "@pages/ui/toolTips";
import Typographys from "@pages/ui/typography";
import Videos from "@pages/ui/video";
import WidgetsBanners from "@pages/widgets/banners";
import WidgetsCard from "@pages/widgets/cards";
import WidgetsCharts from "@pages/widgets/charts";
import WidgetsData from "@pages/widgets/widgetsData";
import AccountSettings from "@pages/account/settings";
import AccountSecurity from "@pages/account/security";
// import AccountBillingPlan from "@pages/accountBillingPlan";
import SkillsPage from "@pages/profile/skills/skillsPage.tsx";
import PersonalInfoPage from "@pages/profile/personalInfo/personalInfoPage.tsx";
import AccountNotification from "@pages/account/notification";
import AccountStatements from "@pages/account/statements";
import AccountSessions from "@pages/account/statements";
import UserPage from "@pages/profile";
import UserActivity from "@pages/profile/userActivity";
import UserDocuments from "@pages/profile/userDocuments";
import PricingPage from "@pages/page/pricing";
import PricingAdmin from "@pages/page/pricingAdmin";
import Faq from "@pages/page/faq";
import ComingSoon from "@pages/page/comingSoon";
import Maintenance from "@pages/page/maintenance";
import PrivacyPolicy from "@pages/page/privacyPolicy";
import HelpCenter from "@pages/page/helpCenter";
import PageNotFoundError from "@pages/page/404";
import FiveZeroZero from "@pages/page/500";
import EnableDisable from "@pages/table/datatables/enableDisable";
import UserNotes from "@src/pages/page/userNotes";
import Login from "@pages/auth/login.tsx";
import Register from "@pages/auth/register.tsx";
import ResetPassword from "@pages/auth/resetPassword.tsx";
import VerifyEmail from "@pages/auth/verifyEmail.tsx";
import ForgotPassword from "@pages/auth/forgotPassword.tsx";
import Account from "@pages/account";
import {Navigate} from "react-router";
import UserProfileOverView from "@pages/profile/overview";
import SpinLoader from '@src/components/custom/Loader.tsx'
import EducationPage from "@pages/profile/education/educationPage.tsx";
import ExperiencePage from "@pages/profile/experience/experiencePage.tsx";
import ResumeBuilder from '@pages/builder/ResumeBuilder.tsx'


import TemplateGallery from '@pages/Template/TemplatesGallery.tsx'

interface IRoute {
    path: string;
    component: ReactNode;
    children?: IRoute[];
}


const routes: IRoute[] = [

        //dashboards
        {path: "/loading", component: <SpinLoader/>},
        {path: "/", component: <TemplateGallery/>},
        {path: "/builder", component: <ResumeBuilder/>},

        // forms
        {path: "/form/basic-input", component: <BasicInput/>},
        {path: "/form/input-group", component: <InputGroup/>},
        {path: "/form/file-input", component: <FileInput/>},
        {path: "/form/select", component: <SelectPage/>},
        {path: "/form/pickers", component: <Pickers/>},
        {path: "/form/range", component: <Range/>},
        {path: "/form/switches", component: <Switches/>},
        {path: "/form/checkbox-radio", component: <CheckboxRadio/>},
        {path: "/form/input-spin", component: <InputSpin/>},
        {path: "/form/recaptcha", component: <Recaptcha/>},
        {path: "/form/clipboard", component: <Clipboards/>},
        {path: "form/wizard-basic", component: <WizardBasic/>},

        //tables
        {path: "/table/base", component: <BaseTables/>},
        {path: "/table/datatables/basic", component: <BasicTables/>},
        {path: "/table/datatables/bordered", component: <Bordered/>},
        {path: "/table/datatables/stripe", component: <Stripe/>},
        {path: "/table/datatables/hover", component: <Hover/>},
        {path: "/table/datatables/row-grouping", component: <RowGrouPing/>},
        {path: "/table/datatables/enable-disable", component: <EnableDisable/>},

        // ui elements
        {path: "/ui/accordion", component: <Accodion/>},
        {path: "/ui/alerts", component: <Alerts/>},


        {path: "/ui/badge", component: <Badge/>},
        {path: "/ui/breadcrumb", component: <BreadCrumbs/>},
        {path: "/ui/buttons-group", component: <ButtonsGroup/>},
        {path: "/ui/buttons", component: <Button/>},
        {path: "/ui/button-navigation", component: <ButtonNavigation/>},
        {path: "/ui/cards", component: <Cards/>},
        {path: "/ui/colors", component: <Colors/>},
        {path: "/ui/cookie", component: <Cookies/>},
        {path: "/ui/drawer", component: <Drawer/>},
        {path: "/ui/dropdown", component: <Dropdowns/>},
        {path: "/ui/gallery", component: <Gallerys/>},
        {path: "/ui/links", component: <Links/>},
        {path: "/ui/list-group", component: <ListGroups/>},
        {path: "/ui/loader", component: <Loader/>},
        {path: "/ui/modal", component: <Modals/>},
        {path: "/ui/notification", component: <Notifications/>},
        {path: "/ui/pagination", component: <Paginations/>},
        {path: "/ui/progress-bar", component: <ProgressBars/>},
        {path: "/ui/tabs", component: <Tabs/>},
        {path: "/ui/timeline", component: <TimeLine/>},
        {path: "/ui/tooltips", component: <Tooltips/>},
        {path: "/ui/typography", component: <Typographys/>},
        {path: "/ui/video", component: <Videos/>},

        // advanced ui
        {path: "/ui/advanced-3d-effect", component: <AdvancedEffect/>},
        {path: "/ui/advanced-animation", component: <AdvancedAnimation/>},
        {path: "/ui/advanced-bot", component: <Boat/>},
        {path: "/ui/advanced-highlight", component: <Highlight/>},
        {path: "/ui/advanced-mask", component: <Mask/>},
        {path: "/ui/advanced-simplebar", component: <Simplebar/>},
        {path: "/ui/advanced-swiper", component: <SwiperElement/>},
        {path: "/ui/advanced-tree", component: <Tree/>},
        {path: "/ui/advanced-word-counter", component: <WordCounters/>},
        {path: "/ui/advanced-image-annotation", component: <ImageAnnotation/>},


        // widgets
        {path: "/widgets/banners", component: <WidgetsBanners/>},
        {path: "/widgets/cards", component: <WidgetsCard/>},
        {path: "/widgets/charts", component: <WidgetsCharts/>},
        {path: "/widgets/data", component: <WidgetsData/>},

        //page

        {path: "/page/pricing", component: <PricingPage/>},
        {path: "/page/pricing-admin", component: <PricingAdmin/>},
        {path: "/page/faq", component: <Faq/>},

        {path: "/page/privacy-policy", component: <PrivacyPolicy/>},
        {path: "/page/help-center", component: <HelpCenter/>},


        {
            path: "/profile",
            component:
                <UserPage/>,
            children: [
                {index: true, element: <Navigate to="overview" replace/>},
                {path: "overview", component: <UserProfileOverView/>},
                {path: "activity", component: <UserActivity/>},
                {path: "documents", component: <UserDocuments/>},
                {path: "notes", component: <UserNotes/>},
                {path: "projects", component: <AccountStatements/>},
                {path: "education", component: <EducationPage/>},
                {path: "experience", component: <ExperiencePage/>},
                {path: "skills", component: <SkillsPage/>},
                { path: "personal-info", component: <PersonalInfoPage /> },
            ],
        },

        {
            path: "/account",
            component:
                <Account/>,
            children:
                [
                    {index: true, element: <Navigate to="settings" replace/>},
                    {path: "settings", component: <AccountSettings/>},
                    {path: "security", component: <AccountSecurity/>},
                    {path: "notification", component: <AccountNotification/>},
                    {path: "sessions", component: <AccountSessions/>},
                    {path: "statements", component: <AccountStatements/>},
                ]
        }
    ]
;

const nonAuthRoutes: IRoute[] = [
    {path: "/page/coming-soon", component: <ComingSoon/>},
    {path: "/page/maintenance", component: <Maintenance/>},
    {path: "/page/404", component: <PageNotFoundError/>},
    {path: "/page/500", component: <FiveZeroZero/>},

    //  authentication
    {path: "/auth/sign-in", component: <Login/>},
    {path: "/auth/sign-up", component: <Register/>},
    {path: "/auth/reset-password/:token", component: <ResetPassword/>},
    {path: "/auth/verify-email", component: <VerifyEmail/>},
    {path: "/auth/forgot-password", component: <ForgotPassword/>},
    {path: "*", component: <PageNotFoundError/>},
];

export {routes, nonAuthRoutes};
