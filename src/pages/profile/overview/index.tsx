import React, {useState} from "react";
import {BriefcaseBusiness, Cake, Globe, Mail, MapPin, Monitor, Phone,} from "lucide-react";
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

const UserProfileOverView: React.FC = () => {
    const [followerCount, setFollowerCount] = useState<number>(2459);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);

    const toggleFollowers = async () => {
        setIsFollowing(!isFollowing);
        setActive(true);

        const timer = setTimeout(() => {
            setActive(false);
            const newCount = isFollowing ? followerCount - 1 : followerCount + 1;
            setFollowerCount(newCount);
        }, 1000);

        return () => clearTimeout(timer);
    };

    return (
        <React.Fragment>
            {/* profilePics status */}
            <div className="grid grid-cols-12 mt-space gap-space">


                {/* profilePics data */}
                <div className="col-span-12 md:col-span-7 lg:col-span-8">
                    <h6 className="mb-2">Overview</h6>
                    <p className="mb-2 text-gray-500 dark:text-dark-500">
                        Hello, I'm <span className="font-medium">Sophia Mia</span>, a
                        passionate UI/UX designer dedicated to crafting seamless digital
                        experiences that blend elegance with functionality. With a keen eye
                        for detail and a deep understanding of user psychology, I strive to
                        create interfaces that not only look stunning but also intuitively
                        guide users towards their goals.
                    </p>
                    <p className="mb-3 text-gray-500 dark:text-dark-500">
                        I believe in the power of collaboration and enjoy working closely
                        with cross-functional teams, including developers, product managers,
                        and stakeholders. By fostering open communication and incorporating
                        diverse perspectives, I ensure that the final product exceeds
                        expectations and delights users.
                    </p>

                    <h6 className="mb-2">Experience</h6>

                    <ul className="timeline">
                        <li className="timeline-primary active">
                            <h6 className="mb-1">UI/UX Designer - March 2020 - Present</h6>
                            <p className="mb-2 text-sm text-gray-500 dark:text-dark-500">
                                XYZ Tech Solutions, San Francisco, CA
                            </p>
                            <ul className="flex flex-col gap-2 text-gray-500 list-disc list-inside dark:text-dark-500">
                                <li>
                                    Designed intuitive user interfaces for web and mobile
                                    applications, focusing on user experience optimization.
                                </li>
                                <li>
                                    Conducted user research, usability testing, and gathered
                                    feedback to iterate on designs and improve user satisfaction.
                                </li>
                                <li>
                                    Collaborated with cross-functional teams including product
                                    managers, developers, and stakeholders to translate business
                                    requirements into user-centric design solutions.
                                </li>
                                <li>
                                    Created wireframes, prototypes, and mockups using tools such
                                    as Sketch, Adobe XD, and Figma.
                                </li>
                                <li>
                                    Implemented responsive design principles to ensure seamless
                                    user experiences across various devices and screen sizes.
                                </li>
                                <li>
                                    Led design workshops and presentations to communicate design
                                    concepts and rationale to team members and stakeholders.
                                </li>
                                <li>
                                    Contributed to the development of design systems and style
                                    guides to maintain design consistency and scalability across
                                    products.
                                </li>
                            </ul>
                        </li>
                        <li className="timeline-primary active">
                            <h6 className="mb-1">Junior UI/UX Designer</h6>
                            <p className="mb-2 text-sm text-gray-500 dark:text-dark-500">
                                ABC Design Studio, New York, NY
                            </p>
                            <ul className="flex flex-col gap-2 text-gray-500 list-disc list-inside dark:text-dark-500">
                                <li>
                                    Assisted in the design and development of user interfaces for
                                    web and mobile applications.
                                </li>
                                <li>
                                    Conducted competitive analysis and market research to identify
                                    design trends and best practices.
                                </li>
                                <li>
                                    Collaborated with senior designers to create wireframes,
                                    prototypes, and high-fidelity mockups.
                                </li>
                                <li>
                                    Participated in usability testing sessions and analyzed user
                                    feedback to refine design concepts.
                                </li>
                                <li>
                                    Supported the implementation of design solutions by providing
                                    assets and design specifications to development teams.
                                </li>
                                <li>
                                    Maintained and organized design files and assets using version
                                    control systems.
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <h6 className="mt-3 mb-2">Portfolio Highlights</h6>

                    <div className="grid grid-cols-2 mb-5 lg:grid-cols-3 gap-space">
                        <div className="text-center group/item">
                            <div className="overflow-hidden rounded-md">
                                <img
                                    src={Image1}
                                    alt="galleryImg"
                                    className="transition duration-200 ease-linear group-hover/item:scale-105 group-hover/item:skew-x-3"
                                />
                            </div>
                            <h6 className="mt-2">
                                <Link to="#!">Chat Application</Link>
                            </h6>
                        </div>
                        <div className="text-center group/item">
                            <div className="overflow-hidden rounded-md">
                                <img
                                    src={Image2}
                                    alt="galleryImg"
                                    className="transition duration-200 ease-linear group-hover/item:scale-105 group-hover/item:skew-x-3"
                                />
                            </div>
                            <h6 className="mt-2">
                                <Link to="#!">CRM React Projects</Link>
                            </h6>
                        </div>
                        <div className="text-center group/item">
                            <div className="overflow-hidden rounded-md">
                                <img
                                    src={Image4}
                                    alt="galleryImg"
                                    className="transition duration-200 ease-linear group-hover/item:scale-105 group-hover/item:skew-x-3"
                                />
                            </div>
                            <h6 className="mt-2">
                                <Link to="#!">HR Management Team</Link>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default UserProfileOverView;
