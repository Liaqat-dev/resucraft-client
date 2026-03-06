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
        return (
            <>
                <style>{`
                    .rc-tb-cta {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.35rem;
                        padding: 0.34rem 0.85rem;
                        background: linear-gradient(135deg, #0F172A 0%, #1e293b 100%);
                        color: #fff !important;
                        border-radius: 999px;
                        font-size: 0.79rem;
                        font-weight: 500;
                        text-decoration: none !important;
                        border: 1px solid #334155;
                        position: relative;
                        overflow: hidden;
                        transition: box-shadow 0.2s, transform 0.15s;
                        white-space: nowrap;
                    }
                    .rc-tb-cta::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(
                            105deg,
                            transparent 35%,
                            rgba(192,154,58,0.22) 50%,
                            transparent 65%
                        );
                        background-size: 250% 100%;
                        background-position: 250% 0;
                        transition: background-position 0.55s ease;
                    }
                    .rc-tb-cta:hover::before {
                        background-position: -250% 0;
                    }
                    .rc-tb-cta:hover {
                        box-shadow: 0 4px 16px rgba(15,23,42,0.32), 0 0 0 1px rgba(192,154,58,0.28);
                        transform: translateY(-1px);
                    }
                    .rc-tb-signin {
                        font-size: 0.79rem;
                        font-weight: 500;
                        text-decoration: none !important;
                        padding: 0.34rem 0.55rem;
                        border-radius: 6px;
                        transition: color 0.15s, background 0.15s;
                        white-space: nowrap;
                        color: #64748b;
                    }
                    .rc-tb-signin:hover {
                        color: #0F172A;
                        background: rgba(15,23,42,0.05);
                    }
                    [data-mode=dark] .rc-tb-signin {
                        color: #94a3b8;
                    }
                    [data-mode=dark] .rc-tb-signin:hover {
                        color: #f8fafc;
                        background: rgba(255,255,255,0.06);
                    }
                `}</style>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Link to="/auth/sign-in" className="rc-tb-signin">
                        Sign in
                    </Link>
                    <Link to="/auth/sign-up" className="rc-tb-cta">
                        {/* mini resume icon */}
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                            style={{ flexShrink: 0 }}>
                            <rect x="4" y="3" width="16" height="18" rx="2"/>
                            <line x1="8" y1="8" x2="16" y2="8"/>
                            <line x1="8" y1="12" x2="13" y2="12"/>
                            <line x1="8" y1="16" x2="11" y2="16"/>
                        </svg>
                        <span style={{ position: 'relative', zIndex: 1 }}>Start crafting</span>
                        <span style={{ color: '#C09A3A', position: 'relative', zIndex: 1, fontSize: '0.85rem' }}>↗</span>
                    </Link>
                </div>
            </>
        );
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
                    src={user?.profilePic?.url || getAvatar(user?.username)}
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
                                src={user?.profilePic?.url || getAvatar(user.username)}
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
