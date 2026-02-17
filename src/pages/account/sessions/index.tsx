import React, {useEffect, useState} from "react";
import {ChevronRight, LogOut, MonitorSmartphone, MoveRight, Smartphone, Tablet,} from "lucide-react";
import {Link} from "react-router-dom";
import {NextPageWithLayout} from "@dtos/layout";
import {Modal} from "@src/components/custom/modal/modal";
import {authService} from "@src/services/authService";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Session {
    sessionId: string;
    deviceName: string;
    deviceType?: string;
    browser: string;
    os: string;
    ipAddress: string;
    location?: {
        city: string;
        country: string;
    };
    lastActivity: string;
    createdAt: string;
    isCurrent: boolean;
}

const DeviceCardSkeleton: React.FC = () => {
    return (
        <div className="mb-0 card S">
            <div className="flex items-center gap-3 card-body">
                <div className="flex items-center justify-center size-12 shrink-0">
                    <Skeleton circle width={48} height={48} />
                </div>
                <div className="grow">
                    <div className="mb-2">
                        <Skeleton width={180} height={20} />
                    </div>
                    <div className="mb-1">
                        <Skeleton width={220} height={14} />
                    </div>
                    <div>
                        <Skeleton width={160} height={12} />
                    </div>
                </div>
                <div className="shrink-0">
                    <Skeleton width={24} height={24} />
                </div>
            </div>
        </div>
    );
};

const DeviceCard: React.FC<{
    session: Session;
    onRevoke: (sessionId: string, deviceName: string) => void;
    isRevoking: boolean;
}> = ({session, onRevoke, isRevoking}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const getDeviceIcon = () => {
        switch (session.deviceType?.toLowerCase()) {
            case "mobile":
                return Smartphone;
            case "tablet":
                return Tablet;
            default:
                return MonitorSmartphone;
        }
    };

    const DeviceIcon = getDeviceIcon();
    const lastActive = new Date(session.lastActivity);

    return (
        <div className="mb-0 card">
            <div className="flex items-center gap-3 card-body">
                <div className="flex items-center justify-center size-12 shrink-0">
                    <DeviceIcon
                        className={
                            session.isCurrent
                                ? "text-green-500 fill-green-500/10"
                                : "text-gray-500 fill-gray-100 dark:text-dark-500 dark:fill-dark-850"
                        }
                    />
                </div>
                <div className="grow">
                    <h6 className="mb-1">
                        {session.deviceName}{" "}
                        <span
                            className={`text-xs ltr:ml-1 rtl:mr-1  ${
                                session.isCurrent ? "badge badge-green" :null
                            }`}
                        >
              {session.isCurrent ? "Current" : null}
            </span>
                    </h6>
                    <p className="text-sm text-gray-500 dark:text-dark-500">
                        {session.location
                            ? `${session.location.city}, ${session.location.country}`
                            : "Unknown Location"}{" "}
                        - {session.ipAddress}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-dark-600 mt-1">
                        Last active: {lastActive.toLocaleString()}
                    </p>
                </div>
                <div className="dropdown shrink-0">
                    <button onClick={toggleDropdown} className="flex link link-primary">
                        <ChevronRight data-lucide="chevron-right"></ChevronRight>
                    </button>
                    {isOpen && (
                        <div className="p-2 dropdown-menu dropdown-right">
                            <Link to="#!" className="dropdown-item">
                                {session.browser} • {session.os}
                            </Link>
                            {!session.isCurrent && (
                                <button
                                    onClick={() => onRevoke(session.sessionId, session.deviceName)}
                                    disabled={isRevoking}
                                    className="dropdown-item text-red-600 disabled:opacity-50"
                                >
                                    {isRevoking ? "Revoking..." : "Log Out"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AccountSessions: NextPageWithLayout = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [revoking, setRevoking] = useState<string | null>(null);
    const [modalState, setModalState] = useState<{ [key: string]: boolean }>({
        logoutAllModal: false,
    });

    useEffect(() => {
        document.title = "Account Sessions | ResuCraft";
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            const data = await authService.getSessions();
            setSessions(data.sessions);
        } catch (error) {
            toast.error("Failed to load sessions");
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (sessionId: string, deviceName: string) => {
        if (!confirm(`Revoke session on ${deviceName}?`)) return;

        setRevoking(sessionId);
        try {
            await authService.revokeSession(sessionId);
            setSessions(sessions.filter((s) => s.sessionId !== sessionId));
            toast.success("Session revoked successfully");
        } catch (error) {
            toast.error("Failed to revoke session");
        } finally {
            setRevoking(null);
        }
    };

    const handleLogoutAll = async () => {
        if (
            !confirm("Logout from all devices? You will be redirected to login.")
        )
            return;

        try {
            await authService.logoutAll();
            toast.success("Logged out from all devices");
            window.location.href = "/login";
        } catch (error) {
            toast.error("Failed to logout from all devices");
        } finally {
            closeModal("logoutAllModal");
        }
    };

    const openModal = (key: string) =>
        setModalState((prev) => ({...prev, [key]: true}));
    const closeModal = (key: string) =>
        setModalState((prev) => ({...prev, [key]: false}));

    return (
        <React.Fragment>
            <div className="mt-5 card">
                <div className="flex items-center gap-3 card-header">
                    <h6 className="card-title grow">
                        {loading ? (
                            <Skeleton width={250} height={24} />
                        ) : (
                            `Device and active sessions (${sessions.length}/5)`
                        )}
                    </h6>
                    {!loading && (
                        <button
                            type="button"
                            onClick={() => openModal("logoutAllModal")}
                            data-modal-target="logoutAllModal"
                            className="flex px-3 py-1.5 text-xs font-medium btn-sub-gray btn"
                        >
                            All Logouts <MoveRight className="inline-block ml-2 size-4"/>
                        </button>
                    )}
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {[...Array(3)].map((_, index) => (
                                <DeviceCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-12">
                            <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                No Active Sessions
                            </h2>
                            <p className="text-gray-600">
                                You don't have any active sessions on other devices.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {sessions.map((session) => (
                                <DeviceCard
                                    key={session.sessionId}
                                    session={session}
                                    onRevoke={handleRevoke}
                                    isRevoking={revoking === session.sessionId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* modal */}
            <Modal
                isOpen={modalState.logoutAllModal}
                id="logoutAllModal"
                onClose={() => closeModal("logoutAllModal")}
                position="modal-center"
                size="modal-xs"
                contentClass="text-center p-7"
                content={(onClose) => (
                    <>
                        <div
                            className="flex items-center justify-center mx-auto mb-4 bg-red-500 rounded-full size-12 text-red-50 ring-4 ring-red-100">
                            <LogOut className="size-6"></LogOut>
                        </div>
                        <h5 className="mb-2">All Devices Logout</h5>
                        <p className="mb-5 text-gray-500">
                            Are you sure you want to log out from all device?
                        </p>
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={handleLogoutAll} className="btn btn-red">
                                Logout Device
                            </button>
                            <button onClick={onClose} className="btn link link-primary">
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            />
        </React.Fragment>
    );
};

export default AccountSessions;