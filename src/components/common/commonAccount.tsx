import {BadgeCheck} from "lucide-react";
import React from "react";
import {useAuth} from "@hooks/useAuth.ts";
import {getAvatar} from "@src/utils/url_helper.ts";
import Skeleton from "react-loading-skeleton";

const CommonAccount = () => {
    const {user} = useAuth();
    return (
        <React.Fragment>
            <div className="relative mb-6">
                <div className="relative overflow-hidden rounded-md h-44 bg-primary-500/10">
                    <div
                        className="border-[60px] border-t-primary-500 border-l-primary-500 absolute opacity-10 -top-2 left-0 rotate-45 size-96"></div>
                    <div
                        className="border-[60px] border-green-500 absolute opacity-10 top-20 left-8 rotate-45 size-80"></div>
                    <div
                        className="border-[60px] border-pink-500 absolute opacity-10 top-36 left-28 rotate-45 size-40"></div>
                </div>
                <div className="text-center">
                    <div className="relative inline-block mx-auto">
                        <div
                            className="relative p-1 rounded-full bg-gradient-to-tr from-primary-300 via-red-300 to-green-300 -mt-14">
                            <img
                                src={user?.avatarUrl || getAvatar(user?.name || "NA")}
                                alt="userImg"
                                className="rounded-full size-11 bg-cover"
                            />
                        </div>
                        <div
                            className="absolute border-2 border-white dark:border-dark-900 rounded-full size-4 bg-green-500 bottom-1 ltr:right-1 rtl:left-2.5"></div>
                    </div>
                     <h5 className="mt-2 mb-1 ">{user?<span>{user.username}
                         {user?.isVerified ? <BadgeCheck
                             className="inline-block text-primary-500 fill-primary-500/20 size-5"></BadgeCheck> : null}</span>: <Skeleton width={100} height={25} />}

                    </h5>
                    <ul className="flex flex-wrap items-center justify-center gap-2 text-gray-500 dark:text-dark-500 text-14">
                        <li>
                            <span className="align-middle">Engineer</span>
                        </li>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
};

export default CommonAccount;
