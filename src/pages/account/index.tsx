import React, {useEffect} from "react";
import {Bell, ListTree, LogOut, ShieldCheck, UserRound} from "lucide-react";
import {NextPageWithLayout} from "@dtos/layout";
import CommonAccount from "@src/components/common/commonAccount";
import {Tab, Tabs} from "@src/components/custom/tabs/tabOutletBased.tsx";


const Account: NextPageWithLayout = () => {

    useEffect(() => {
        document.title =
            "Account Settings | ResuCraft";
    }, []);

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
                    icon={
                        <ShieldCheck className="inline-block size-4 ltr:mr-2 rtl:ml-2"/>
                    }
                    label="Security"
                    path="/account/security"
                >
                    <div>Security Content</div>
                </Tab>
                <Tab
                    icon={<Bell className="inline-block size-4 ltr:mr-2 rtl:ml-2"/>}
                    label="Notification"
                    path="/account/notification"
                >
                    <div>Notification Content</div>
                </Tab>
                <Tab
                    icon={<LogOut className="inline-block size-4 ltr:mr-2 rtl:ml-2"/>}
                    label="Sessions"
                    path="/account/sessions"
                >
                    <div>Logs Content</div>
                </Tab>
                <Tab
                    icon={<ListTree className="inline-block size-4 ltr:mr-2 rtl:ml-2"/>}
                    label="Logs"
                    path="/account/statements"
                >
                    <div>Statements Content</div>
                </Tab>
            </Tabs>
        </div>
    );
};
export default Account;
