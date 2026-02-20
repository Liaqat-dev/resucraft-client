import { NextPageWithLayout } from "@dtos/layout";
import React, { useEffect } from "react";
import { Tab, Tabs } from "@src/components/custom/tabs/tabOutletBased.tsx";
import CommonAccount from "@src/components/common/commonAccount.tsx";
import { Eye , FileText,
    List,
    Monitor,
    Sparkles, GraduationCap,
    Briefcase } from "lucide-react";

const Profile: NextPageWithLayout = () => {
    useEffect(() => {
        document.title =
            "User Overview | Domiex - React TS Admin & Dashboard Template";
    }, []);

    return (
        <React.Fragment>
            <CommonAccount />

            <Tabs
                ulProps="pb-2 overflow-x-auto tabs-pills lg:pb-0"
                activeTabClass="active"
                contentProps="mt-5"
                otherClass="nav-item text-gray-500 dark:text-dark-500 [&.active]:bg-primary-500 [&.active]:text-primary-50"
                spanProps="align-middle whitespace-nowrap"
            >
                <Tab
                    icon={<Eye className="inline-block size-4 ltr:mr-2 rtl:ml-2" />}
                    label="Overview"
                    path="/profile/overview"
                ></Tab>
                <Tab
                    icon={
                        <GraduationCap className="inline-block size-4 ltr:mr-2 rtl:ml-2" />
                    }
                    label="Education"
                    path="/profile/education"
                >
                    <div>Education Content</div>
                </Tab>

                <Tab
                    icon={
                        <Briefcase className="inline-block size-4 ltr:mr-2 rtl:ml-2" />
                    }
                    label="Experience"
                    path="/profile/experience"
                >
                    <div>Experience Content</div>
                </Tab>

                <Tab
                    icon={
                        <Sparkles className="inline-block size-4 ltr:mr-2 rtl:ml-2" />
                    }
                    label="Activity"
                    path="/profile/activity"
                >
                    <div>Security Content</div>
                </Tab>
                <Tab
                    icon={<FileText className="inline-block size-4 ltr:mr-2 rtl:ml-2" />}
                    label="Documents"
                    path="/profile/documents"
                >
                    <div>Notification Content</div>
                </Tab>
                <Tab
                    icon={<List className="inline-block size-4 ltr:mr-2 rtl:ml-2" />}
                    label="Notes"
                    path="/profile/notes"
                >
                    <div>Statements Content</div>
                </Tab>
                <Tab
                    icon={<Monitor className="inline-block size-4 ltr:mr-2 rtl:ml-2" />}
                    label="Projects"
                    path="/profile/projects"
                >
                    <div>Logs Content</div>
                </Tab>
            </Tabs>
        </React.Fragment>
    );
};
export default Profile;
