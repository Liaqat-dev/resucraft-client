import React from "react";
import {Cake, Github, Linkedin, Mail, MapPin, Phone, User,} from "lucide-react";
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

const SectionDivider: React.FC<{ title: string }> = ({title}) => (
    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-dark-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-dark-500 mb-3">
            {title}
        </p>
    </div>
);

// ── Date formatters ───────────────────────────────────────────────────────────

function formatDob(dob?: string): string | null {
    if (!dob) return null;
    const d = new Date(dob);
    if (isNaN(d.getTime())) return dob;
    return d.toLocaleDateString("default", {year: "numeric", month: "long", day: "numeric"});
}

function formatPeriod(start?: string, end?: string, current?: boolean): string {
    if (!start) return "";
    const startDate = new Date(start).toLocaleDateString("default", {month: "long", year: "numeric"});
    if (current) return `${startDate} - Present`;
    if (!end) return startDate;
    const endDate = new Date(end).toLocaleDateString("default", {month: "long", year: "numeric"});
    return `${startDate} - ${endDate}`;
}

// ── Page ──────────────────────────────────────────────────────────────────────

const UserProfileOverView: React.FC = () => {
    const {
        personalInfo,
        experience,
        education,
        projects,
        certificates,
        skills,
        fetchPersonalInfo,
        fetchExperience,
        fetchEducation,
        fetchProjects,
        fetchCertificates,
        fetchSkills,
    } = useProfile();

    React.useEffect(() => {
        fetchPersonalInfo();
        fetchExperience();
        fetchEducation();
        fetchProjects();
        fetchCertificates();
        fetchSkills();
    }, []);

    const fullName = [personalInfo?.firstName, personalInfo?.lastName].filter(Boolean).join(" ") || "User Name";

    return (
        <React.Fragment>
            <div className="grid grid-cols-12 mt-space gap-8 max-w-7xl mx-auto px-4">

                {/* ── Left sidebar ────────────────────────────────────── */}
                <div className="col-span-12 md:col-span-5 lg:col-span-4 space-y-5">

                    {/* Introductions Card */}
                    <div className="card">
                        <div className="card-header flex items-center gap-3">
                            <div
                                className="size-8 rounded-md bg-primary-50 dark:bg-primary-950 flex items-center justify-center shrink-0">
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
                            {personalInfo?.profession && (
                                <InfoRow icon={<User size={13}/>} label="Profession" value={personalInfo.profession}/>
                            )}
                            <InfoRow icon={<MapPin size={13}/>} label="Location" value={personalInfo?.address}/>
                            <InfoRow icon={<Cake size={13}/>} label="Date of Birth"
                                     value={formatDob(personalInfo?.dob)}/>

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

                {/* ── Right Main Side (Resume Content) ────────────────── */}
                <div className="col-span-12 md:col-span-7 lg:col-span-8 space-y-12">
                    
                    {/* Professional Summary */}
                    {personalInfo?.bio && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-dark-500 mb-4 border-b border-gray-100 dark:border-dark-800 pb-1">
                                Professional Summary
                            </h2>
                            <p className="text-sm text-gray-700 dark:text-dark-300 leading-relaxed text-justify whitespace-pre-line">
                                {personalInfo.bio}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-dark-500 mb-6 border-b border-gray-100 dark:border-dark-800 pb-1">
                                Work Experience
                            </h2>
                            <div className="space-y-8">
                                {experience.map((exp) => (
                                    <div key={exp._id} className="relative pl-6 border-l border-gray-100 dark:border-dark-800">
                                        <div className="absolute -left-[4.5px] top-1.5 size-2 rounded-full bg-primary-500" />
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                            <h3 className="font-bold text-gray-800 dark:text-dark-100 text-base">{exp.role}</h3>
                                            <span className="text-xs font-bold text-gray-500 tabular-nums">
                                                {formatPeriod(exp.startDate, exp.endDate, exp.currentlyWorking)}
                                            </span>
                                        </div>
                                        <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3">
                                            {exp.company}
                                        </div>
                                        {exp.description && (
                                            <p className="text-sm text-gray-600 dark:text-dark-400 leading-relaxed whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-dark-500 mb-6 border-b border-gray-100 dark:border-dark-800 pb-1">
                                Education
                            </h2>
                            <div className="space-y-8">
                                {education.map((edu) => (
                                    <div key={edu._id} className="relative pl-6 border-l border-gray-100 dark:border-dark-800">
                                        <div className="absolute -left-[4.5px] top-1.5 size-2 rounded-full bg-gray-300 dark:bg-dark-700" />
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                            <h3 className="font-bold text-gray-800 dark:text-dark-100 text-base">
                                                {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                                            </h3>
                                            <span className="text-xs font-bold text-gray-500 tabular-nums">
                                                {formatPeriod(edu.startDate, edu.endDate)}
                                            </span>
                                        </div>
                                        <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3">
                                            {edu.school}
                                        </div>
                                        {edu.description && (
                                            <p className="text-sm text-gray-600 dark:text-dark-400 leading-relaxed whitespace-pre-line">
                                                {edu.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-dark-500 mb-6 border-b border-gray-100 dark:border-dark-800 pb-1">
                                Technical & Soft Skills
                            </h2>
                            <div className="space-y-6">
                                {["Technical", "Soft", "Other"].map((cat) => {
                                    const filteredSkills = skills.filter((s) => s.category === cat);
                                    if (filteredSkills.length === 0) return null;
                                    return (
                                        <div key={cat}>
                                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-dark-400 mb-2">
                                                {cat} Skills
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {filteredSkills.map((skill) => (
                                                    <span key={skill._id} className="text-xs font-medium px-2 py-1 bg-gray-50 dark:bg-dark-850 text-gray-700 dark:text-dark-300 border border-gray-100 dark:border-dark-800 rounded">
                                                        {skill.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-dark-500 mb-6 border-b border-gray-100 dark:border-dark-800 pb-1">
                                Key Projects
                            </h2>
                            <div className="space-y-8">
                                {projects.map((project) => (
                                    <div key={project._id} className="relative pl-6 border-l border-gray-100 dark:border-dark-800 group">
                                        <div className="absolute -left-[4.5px] top-1.5 size-2 rounded-full bg-primary-500" />
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                            <h3 className="font-bold text-gray-800 dark:text-dark-100 text-base group-hover:text-primary-600 transition-colors">
                                                {project.title}
                                            </h3>
                                            <span className="text-xs font-bold text-gray-500 tabular-nums">
                                                {formatPeriod(project.startDate, project.endDate)}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                                            {project.technologies && project.technologies.length > 0 && (
                                                <div className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-tight">
                                                    {project.technologies.join(" • ")}
                                                </div>
                                            )}
                                            <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider ml-auto">
                                                {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Demo</a>}
                                                {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline">Code</a>}
                                            </div>
                                        </div>
                                        {project.description && (
                                            <p className="text-sm text-gray-600 dark:text-dark-400 leading-relaxed whitespace-pre-line">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certificates */}
                    {certificates && certificates.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-dark-500 mb-6 border-b border-gray-100 dark:border-dark-800 pb-1">
                                Certifications
                            </h2>
                            <div className="space-y-8">
                                {certificates.map((cert) => (
                                    <div key={cert._id} className="relative pl-6 border-l border-gray-100 dark:border-dark-800">
                                        <div className="absolute -left-[4.5px] top-1.5 size-2 rounded-full bg-gray-300 dark:bg-dark-700" />
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                            <h3 className="font-bold text-gray-800 dark:text-dark-100 text-base">{cert.name}</h3>
                                            <span className="text-xs font-bold text-gray-500 tabular-nums">
                                                {new Date(cert.issueDate).toLocaleDateString("default", { month: "long", year: "numeric" })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                                {cert.issuer}
                                            </div>
                                            {cert.credentialUrl && (
                                                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-wider text-primary-600 hover:underline">
                                                    Verify
                                                </a>
                                            )}
                                        </div>
                                        {cert.description && (
                                            <p className="text-sm text-gray-600 dark:text-dark-400 leading-relaxed whitespace-pre-line">
                                                {cert.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default UserProfileOverView;