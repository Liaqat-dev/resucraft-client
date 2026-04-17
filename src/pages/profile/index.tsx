import {NextPageWithLayout} from "@dtos/layout";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {Tab, Tabs} from "@src/components/custom/tabs/tabOutletBased.tsx";
import CommonAccount from "@src/components/common/commonAccount.tsx";
import {Award, Briefcase, Eye, GraduationCap, Lightbulb, Monitor, User} from "lucide-react";
import {fetchFullProfile} from "@src/slices/profile/thunk.ts";
import type {AppDispatch} from "@src/slices/store.ts";

const Profile: NextPageWithLayout = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        document.title = "User Overview | ResuCraft";
        dispatch(fetchFullProfile());
    }, [dispatch]);

    return (
        <div className={'container mx-auto'}>
            <CommonAccount/>

            <Tabs
                ulProps="pb-2 overflow-x-auto tabs-pills lg:pb-0"
                activeTabClass="active"
                contentProps="mt-5"
                otherClass="nav-item text-gray-500 dark:text-dark-500 [&.active]:bg-primary-500 [&.active]:text-primary-50"
                spanProps="align-middle whitespace-nowrap"
            >
                <Tab
                    icon={<Eye className="inline-block size-4 ltr:mr-2 rtl:ml-2"/>}
                    label="Overview"
                    path="/profile/overview"
                ></Tab>
                <Tab
                    icon={<User className="inline-block size-4 ltr:mr-2 rtl:ml-2"/>}
                    label="Personal Info"
                    path="/profile/personal-info"
                >
                    <div>Personal Info Content</div>
                </Tab>
                <Tab
                    icon={
                        <GraduationCap className="inline-block size-4 ltr:mr-2 rtl:ml-2"/>
                    }
                    label="Education"
                    path="/profile/education"
                >
                    <div>Education Content</div>
                </Tab>

                <Tab
                    icon={
                        <Briefcase className="inline-block size-4 ltr:mr-2 rtl:ml-2"/>
                    }
                    label="Experience"
                    path="/profile/experience"
                >
                    <div>Experience Content</div>
                </Tab>
                <Tab
                    icon={<Lightbulb className="inline-block size-4 ltr:mr-2 rtl:ml-2"/>}
                    label="Skills"
                    path="/profile/skills"
                >
                    <div>Skills Content</div>
                </Tab>
                <Tab
                    icon={<Monitor className="inline-block size-4 ltr:mr-2 rtl:ml-2"/>}
                    label="Projects"
                    path="/profile/projects"
                >
                    <div>Projects</div>
                </Tab>
                <Tab
                    icon={
                        <Award className="inline-block size-4 mr-2"/>
                    }
                    label="Certificates"
                    path="/profile/certificates"
                >
                    <div>Certificates</div>
                </Tab>
            </Tabs>
        </div>
    );
};
export default Profile;
