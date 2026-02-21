import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "@hooks/useAuth.ts";
import {Modal} from "@src/components/custom/modal/modal2.tsx";
import UpdateToast from "@custom/toast/updateToast.tsx";
import ErrorToast from "@custom/toast/errorToast.tsx";
import {LogOut, Verified} from "lucide-react";
import {getAvatar} from "@src/utils/url_helper.ts";

function Profile() {
    const {fetchProfile, accessToken, user, logout} = useAuth();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showConfirmSignOut, setShowConfirmSignOut] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (accessToken && !user) {
            fetchProfile();
        }
    }, [accessToken]);
    useEffect(() => {
        // if (accessToken && !user) {
        fetchProfile();
        // }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClose = () => setDropdownOpen(false);
    const handleSignOut = () => {
        try {
            logout();
            UpdateToast("Signed Out Successfully!");
        } catch (error: any) {
            ErrorToast(error.response.data.message);
        }
    };
    if (!user) {
        return;
    }

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button
                type="button"
                title="profile"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="rounded-full btn btn-icon btn-active-gray"
            >
                <img
                    src={user?.profilePic || getAvatar(user?.username)}
                    alt="Profile"
                    className="rounded-full"
                />
            </button>

            {dropdownOpen && (
                <div
                    className="dropdown-menu dropdown-right !w-72"
                    style={{display: "block"}}
                >
                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={user?.profilePic || getAvatar(user.username)}
                                alt="userImg"
                                className="rounded-md size-11"
                            />
                            <div>
                                <h6 className="mb-0.5 flex gap-2 items-center">{user?.username}{user.isVerified ?
                                    <Verified size={15}  color={'blue'}/> : null}</h6>
                                <p className="flex items-center gap-2 text-gray-400 dark:text-dark-500 text-xs ">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <Link
                            onClick={handleClose}
                            to="/profile"
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-dark-850"
                        >
                            <i className="align-baseline ltr:mr-1 rtl:ml-1 ri-user-line"></i>{" "}
                            Profile
                        </Link>
                        <Link
                            onClick={handleClose}
                            to="/account"
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-dark-850"
                        >
                            <i className="align-baseline ltr:mr-1 rtl:ml-1 ri-settings-3-line"></i>
                            Settings & Security
                        </Link>

                        <button
                            onClick={() => {
                                handleClose();
                                setShowConfirmSignOut(true);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-dark-850"
                        >
                            <i className="align-baseline ltr:mr-1 rtl:ml-1 ri-logout-circle-r-line"></i>
                            Sign Out
                        </button>
                        <Link
                            onClick={handleClose}
                            to="/help-center"
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-dark-850"
                        >
                            <i className="align-baseline ltr:mr-1 rtl:ml-1 ri-customer-service-2-line"></i>
                            Help Center
                        </Link>
                    </div>
                </div>
            )}

            <Modal
                size={"modal-sm"}
                isOpen={showConfirmSignOut}
                onClose={() => setShowConfirmSignOut(false)}
                content={
                    <>
                        <div
                            className="flex items-center text-center justify-center mx-auto mb-4 text-red-500 rounded-full bg-red-500/10 size-14 backdrop-blur-sm-xl">
                            <LogOut className="size-7"/>
                        </div>
                        <h5 className="mb-4">
                            Are you sure you want to logout of this session ?
                        </h5>
                    </>
                }
                onAction={handleSignOut}
                actionButtonConfig={{
                    icon: <LogOut className="size-6"/>,
                    label: "Sign Out",
                    onClick: () => {
                        handleSignOut();
                    },
                    variant: "danger",
                }}
            />
        </div>
    );
}

export default Profile;
