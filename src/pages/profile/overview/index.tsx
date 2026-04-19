import React from "react";
import {
    Cake,
    FileText,
    Github,
    GraduationCap,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";
import newImage from "@assets/images/others/new.png";
import qualityImage from "@assets/images/others/quality.png";
import highQualityImage from "@assets/images/others/high-quality.png";
import rewardImage from "@assets/images/others/reward.png";
import {Tooltip} from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Image1 from "@assets/images/gallery/img-01.jpg";
import Image2 from "@assets/images/gallery/img-02.jpg";
import Image4 from "@assets/images/gallery/img-04.jpg";
import {Link} from "react-router-dom";
import {useProfile} from "@hooks/useProfile.ts";

// ── Info row ──────────────────────────────────────────────────────────────────

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value?: string | number | null;
    href?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({icon, label, value, href}) => {
    if (!value) return null;
    return (
        <div className="flex items-center gap-3">
            <span className="shrink-0 size-7 rounded-md bg-gray-50 dark:bg-dark-800 flex items-center justify-center">
                <span className="text-gray-400 dark:text-dark-500">{icon}</span>
            </span>
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-dark-500 leading-none mb-0.5">
                    {label}
                </p>
                {href ? (
                    <Link
                        to={href}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline truncate block"
                    >
                        {String(value)}
                    </Link>
                ) : (
                    <p className="text-sm text-gray-700 dark:text-dark-200 truncate">
                        {String(value)}
                    </p>
                )}
            </div>
        </div>
    );
};

// ── Section divider ───────────────────────────────────────────────────────────

const SectionDivider: React.FC<{title: string}> = ({title}) => (
    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-dark-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-dark-500 mb-3">
            {title}
        </p>
    </div>
);

// ── DOB formatter ─────────────────────────────────────────────────────────────

function formatDob(dob?: string): string | null {
    if (!dob) return null;
    const d = new Date(dob);
    if (isNaN(d.getTime())) return dob;
    return d.toLocaleDateString("default", {year: "numeric", month: "long", day: "numeric"});
}

// ── Page ──────────────────────────────────────────────────────────────────────

const UserProfileOverView: React.FC = () => {
    const {personalInfo} = useProfile();

    const fullName = [personalInfo?.firstName, personalInfo?.lastName].filter(Boolean).join(" ") || null;

    return (
        <React.Fragment>
            <div className="grid grid-cols-12 mt-space gap-space">

                {/* ── Left sidebar ────────────────────────────────────── */}
                <div className="col-span-12 md:col-span-5 lg:col-span-4 space-y-5">

                    {/* Introductions */}
                    <div className="card">
                        <div className="card-header flex items-center gap-3">
                            <div className="size-8 rounded-md bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0">
                                <User size={15} className="text-primary-600 dark:text-primary-400"/>
                            </div>
                            <h6 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                                Profile
                            </h6>
                        </div>

                        <div className="card-body space-y-3">
                            {/* About */}
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-dark-500">
                                About
                            </p>
                            <InfoRow icon={<User size={13}/>} label="Name" value={fullName}/>
                            <InfoRow icon={<MapPin size={13}/>} label="Location" value={personalInfo?.address}/>
                            <InfoRow icon={<Cake size={13}/>} label="Date of Birth" value={formatDob(personalInfo?.dob)}/>

                            {/* Contact */}
                            {(personalInfo?.email || personalInfo?.phone) && (
                                <>
                                    <SectionDivider title="Contact"/>
                                    <InfoRow
                                        icon={<Mail size={13}/>}
                                        label="Email"
                                        value={personalInfo?.email}
                                        href={`mailto:${personalInfo?.email}`}
                                    />
                                    <InfoRow
                                        icon={<Phone size={13}/>}
                                        label="Phone"
                                        value={personalInfo?.phone ? String(personalInfo.phone) : null}
                                        href={`tel:${personalInfo?.phone}`}
                                    />
                                </>
                            )}

                            {/* Socials */}
                            {(personalInfo?.github || personalInfo?.linkedin) && (
                                <>
                                    <SectionDivider title="Socials"/>
                                    <InfoRow
                                        icon={<Github size={13}/>}
                                        label="GitHub"
                                        value={personalInfo?.github}
                                        href={personalInfo?.github}
                                    />
                                    <InfoRow
                                        icon={<Linkedin size={13}/>}
                                        label="LinkedIn"
                                        value={personalInfo?.linkedin}
                                        href={personalInfo?.linkedin}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Right main ──────────────────────────────────────── */}
                <div className="col-span-12 md:col-span-7 lg:col-span-8 space-y-5">

                    {/* Bio */}
                    <div className="card">
                        <div className="card-header flex items-center gap-3">
                            <div className="size-8 rounded-md bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0">
                                <FileText size={15} className="text-primary-600 dark:text-primary-400"/>
                            </div>
                            <h6 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                                About
                            </h6>
                        </div>
                        <div className="card-body">
                            {personalInfo?.bio ? (
                                <p className="text-sm text-gray-500 dark:text-dark-400 leading-relaxed whitespace-pre-line">
                                    {personalInfo.bio}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-400 dark:text-dark-500 italic">
                                    No bio added yet. Go to{" "}
                                    <Link to="../personal-info" className="text-primary-600 dark:text-primary-400 hover:underline not-italic font-medium">
                                        Personal Info
                                    </Link>{" "}
                                    to add one.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Portfolio Highlights */}
                    <div className="card">
                        <div className="card-header flex items-center gap-3">
                            <div className="size-8 rounded-md bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0">
                                <GraduationCap size={15} className="text-primary-600 dark:text-primary-400"/>
                            </div>
                            <h6 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                                Portfolio Highlights
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    {src: Image1, title: "Chat Application"},
                                    {src: Image2, title: "CRM React Projects"},
                                    {src: Image4, title: "HR Management Team"},
                                ].map(({src, title}) => (
                                    <div key={title} className="group">
                                        <div className="overflow-hidden rounded-md border border-gray-100 dark:border-dark-800">
                                            <img
                                                src={src}
                                                alt={title}
                                                className="w-full object-cover transition duration-200 ease-linear group-hover:scale-105"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs font-medium text-gray-600 dark:text-dark-300 text-center truncate">
                                            <Link to="#!" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                                {title}
                                            </Link>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default UserProfileOverView;