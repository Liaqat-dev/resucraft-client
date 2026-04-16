import BasicInput from "@pages/form/basic-input";
import CheckboxRadio from "@pages/form/checkbox-radio";
import Clipboards from "@pages/form/clipboard";
import FileInput from "@pages/form/file-input";
import InputGroup from "@pages/form/input-group";
import InputSpin from "@pages/form/input-spin";
import Range from "@pages/form/range";
import Recaptcha from "@pages/form/recaptcha";
import SelectPage from "@pages/form/select";
import Switches from "@pages/form/switches";
import WizardBasic from "@pages/form/wizard-basic";
import {ReactNode} from "react";
import AccountSecurity from "@pages/account/security";
import SkillsPage from "@pages/profile/skills/skillsPage.tsx";
import PersonalInfoPage from "@pages/profile/personalInfo/personalInfoPage.tsx";
import AccountNotification from "@pages/account/notification";
import AccountStatements from "@pages/account/logs";
import AccountSessions from "@pages/account/sessions";
import UserPage from "@pages/profile";
import Certificates from "@pages/profile/certificates";
import Projects from "@pages/profile/projects";
import PricingPage from "@pages/page/pricing";
import PricingAdmin from "@pages/page/pricingAdmin";
import Faq from "@pages/page/faq";
import ComingSoon from "@pages/page/comingSoon";
import Maintenance from "@pages/page/maintenance";
import PrivacyPolicy from "@pages/page/privacyPolicy";
import HelpCenter from "@pages/page/helpCenter";
import PageNotFoundError from "@pages/page/404";
import FiveZeroZero from "@pages/page/500";
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
import TemplatePreview from '@pages/Template/TemplatePreview.tsx'
import WelcomePage from '@pages/landing/WelcomePage.tsx'
import FeaturesPage from '@pages/landing/FeaturesPage.tsx'
import FAQPage from '@pages/landing/FAQPage.tsx'
import ContactPage from '@pages/landing/ContactPage.tsx'
import AboutPage from '@pages/landing/AboutPage.tsx'
import PosterPage from '@pages/landing/PosterPage.tsx'
import DashboardOverview from '@pages/dashboard/Overview.tsx'
import DashboardUsers from '@pages/dashboard/Users.tsx'
import DashboardTemplates from '@pages/dashboard/Templates.tsx'
import DashboardAnalytics from '@pages/dashboard/Analytics.tsx'
import DashboardMessages from '@pages/dashboard/Messages.tsx'

interface IRoute {
    path: string;
    component: ReactNode;
    children?: IRoute[];
}


const routes: IRoute[] = [

        //dashboards
        {path: "/loading", component: <SpinLoader/>},
        {path: "/", component: <TemplateGallery/>},
        {path: "/templates", component: <TemplateGallery/>},
        {path: "/my-templates", component: <TemplateGallery/>},
        {path: "/templates/:id/preview", component: <TemplatePreview/>},


        // forms
        {path: "/form/basic-input", component: <BasicInput/>},
        {path: "/form/input-group", component: <InputGroup/>},
        {path: "/form/file-input", component: <FileInput/>},
        {path: "/form/select", component: <SelectPage/>},
        {path: "/form/range", component: <Range/>},
        {path: "/form/switches", component: <Switches/>},
        {path: "/form/checkbox-radio", component: <CheckboxRadio/>},
        {path: "/form/input-spin", component: <InputSpin/>},
        {path: "/form/recaptcha", component: <Recaptcha/>},
        {path: "/form/clipboard", component: <Clipboards/>},
        {path: "form/wizard-basic", component: <WizardBasic/>},

        //page

        {path: "/page/pricing", component: <PricingPage/>},
        {path: "/page/pricing-admin", component: <PricingAdmin/>},
        {path: "/page/faq", component: <Faq/>},

        {path: "/page/privacy-policy", component: <PrivacyPolicy/>},
        {path: "/help-center", component: <HelpCenter/>},


        {
            path: "/profile",
            component:
                <UserPage/>,
            children: [
                {index: true, element: <Navigate to="overview" replace/>},
                {path: "overview", component: <UserProfileOverView/>},
                {path: "personal-info", component: <PersonalInfoPage/>},
                {path: "education", component: <EducationPage/>},
                {path: "experience", component: <ExperiencePage/>},
                {path: "skills", component: <SkillsPage/>},
                {path: "projects", component: <Projects/>},
                {path: "certificates", component: <Certificates/>},
            ],
        },

        {
            path: "/account",
            component:
                <Account/>,
            children:
                [
                    {index: true, element: <Navigate to="security" replace/>},
                    {path: "security", component: <AccountSecurity/>},
                    {path: "notification", component: <AccountNotification/>},
                    {path: "sessions", component: <AccountSessions/>},
                    {path: "logs", component: <AccountStatements/>},
                ]
        }
    ]
;

const nonAuthRoutes: IRoute[] = [
    {path: "/page/coming-soon", component: <ComingSoon/>},
    {path: "/page/maintenance", component: <Maintenance/>},
    {path: "/page/404", component: <PageNotFoundError/>},
    {path: "/page/500", component: <FiveZeroZero/>},

    // landing / marketing pages
    {path: "/welcome", component: <WelcomePage/>},
    {path: "/features", component: <FeaturesPage/>},
    {path: "/faq", component: <FAQPage/>},
    {path: "/contact", component: <ContactPage/>},
    {path: "/about", component: <AboutPage/>},
    {path: "/poster", component: <PosterPage/>},

    //  authentication
    {path: "/auth/sign-in", component: <Login/>},
    {path: "/auth/sign-up", component: <Register/>},
    {path: "/auth/reset-password/:token", component: <ResetPassword/>},
    {path: "/auth/verify-email", component: <VerifyEmail/>},
    {path: "/auth/forgot-password", component: <ForgotPassword/>},
    {path: "*", component: <PageNotFoundError/>},
];
const builderRoutes: IRoute[] = [
    {path: "/builder", component: <ResumeBuilder/>},
    {path: "/builder/:id", component: <ResumeBuilder/>},
]

const adminRoutes: IRoute[] = [
    { path: '/dashboard',            component: <DashboardOverview /> },
    { path: '/dashboard/users',      component: <DashboardUsers /> },
    { path: '/dashboard/templates',  component: <DashboardTemplates /> },
    { path: '/dashboard/analytics',  component: <DashboardAnalytics /> },
    { path: '/dashboard/messages',   component: <DashboardMessages /> },
];

export {routes, nonAuthRoutes, builderRoutes, adminRoutes};
