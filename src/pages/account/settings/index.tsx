import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {Upload} from "lucide-react";
import {NextPageWithLayout} from "@dtos/layout";
// import SpinLoader from "@src/components/custom/loader/loader.tsx";
import user17 from "@assets/images/avatar/user-17.png";
import Select from "react-select";

const AccountSettings: NextPageWithLayout = () => {

    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);


    useEffect(() => {
        document.title =
            "Account Settings | Domiex - React TS Admin & Dashboard Template";
    }, []);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };


    return (
        <>
            <div className="mt-5 card">
                <div className="card-body">
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 xl:col-span-3">
                            <h6 className="card-title">Personal Information</h6>
                        </div>
                        <div className="col-span-12 xl:col-span-9">
                            <form >
                                <div className="grid grid-cols-12 gap-5">
                                    <div className="col-span-12">
                                        <div>
                                            <div className="shrink-0">
                                                {photoPreview ? (
                                                    <img
                                                        className="object-cover rounded-md size-20"
                                                        src={photoPreview}
                                                        alt="Selected profile photo"
                                                    />
                                                ) : (
                                                    <img
                                                        className="object-cover rounded-md size-20"
                                                        src={user17}
                                                        alt="Current profile photo"
                                                    />
                                                )}
                                            </div>
                                            <label className="block mt-4">
                              <span className="sr-only">
                                Choose profile photo
                              </span>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <span
                                                    className="btn btn-sub-primary"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                <Upload className="inline-block size-4 me-1"></Upload>
                                <span className="align-middle">
                                  Upload Profile
                                </span>
                              </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <label
                                            htmlFor="firstNameInput"
                                            className="form-label"
                                        >
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstNameInput"
                                            name="firstName"
                                            className="form-input"

                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <label htmlFor="lastNameInput" className="form-label">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastNameInput"
                                            name="lastName"
                                            className="form-input"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                        <label htmlFor="roleInput" className="form-label">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            id="roleInput"
                                            name="role"
                                            className="form-input"

                                            placeholder="Enter your role"
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                        <label
                                            htmlFor="birthDateInput"
                                            className="form-label"
                                        >
                                            Birth of Date
                                        </label>
                                        <input
                                            type="date"
                                            id="birthDateInput"
                                            name="birthDate"
                                            className="form-input"

                                            placeholder="Select date"
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                        <label
                                            htmlFor="joiningDateInput"
                                            className="form-label"
                                        >
                                            Joining Date
                                        </label>
                                        <input
                                            type="date"
                                            id="joiningDateInput"
                                            name="joiningDate"
                                            className="form-input"

                                            placeholder="Select date"
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                        <label htmlFor="emailInput" className="form-label">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="emailInput"
                                            name="email"
                                            className="form-input"

                                            placeholder="example@example.com"
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                        <label
                                            htmlFor="phoneNumberInput"
                                            className="form-label"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            id="phoneNumberInput"
                                            name="phoneNumber"
                                            className="form-input"

                                            placeholder="+(00) 00000 00000"
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                        <label htmlFor="locationInput" className="form-label">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            id="locationInput"
                                            name="location"
                                            className="form-input"

                                            placeholder="Enter location"
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <label
                                            htmlFor="languageSelect"
                                            className="form-label"
                                        >
                                            Language
                                        </label>
                                        <Select
                                            classNamePrefix="select"
                                            id="languageSelect"
                                            isMulti={true}

                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <label
                                            htmlFor="currencySelect"
                                            className="form-label"
                                        >
                                            Currency
                                        </label>
                                        <Select
                                            classNamePrefix="select"
                                            id="currencySelect"
                                            isMulti={true}

                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label
                                            htmlFor="textareaInput2"
                                            className="form-label"
                                        >
                                            Objective
                                        </label>
                                        <textarea
                                            name="objective"
                                            id="textareaInput2"
                                            rows={3}
                                            className="h-auto form-input"

                                            placeholder="Write your objective"
                                        ></textarea>
                                    </div>
                                    <div className="col-span-12 text-right">
                                        <button type="submit" className="btn btn-primary">
                                            Update Profile
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="grid grid-cols-12 gap-3 lg:gap-0 ">
                        <div className="col-span-12 xl:col-span-3">
                            <h6 className="card-title">Public Account</h6>
                        </div>
                        <div className="col-span-12 xl:col-span-9">
                            <div className="items-center gap-3 md:flex">
                                <div
                                    // for="publicProfile"
                                    className="grow"
                                >
                                    <h6 className="mb-1">
                                        Publish your contact information publicly.
                                    </h6>
                                    <p className="text-gray-500 dark:text-dark-500">
                                        Allow anyone viewing your profile to access your
                                        contact information.
                                    </p>
                                </div>
                                <label htmlFor="publicProfile" className="switch-group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            id="publicProfile"
                                            className="sr-only peer"
                                        />
                                        <div className="switch-wrapper"></div>
                                        <div className="switch-dot peer-checked:translate-x-full rtl:peer-checked:-translate-x-full switch-primary"></div>
                                    </div>
                                </label>
                            </div>
                            <div className="items-center gap-3 mt-4 md:flex">
                                <div
                                    // for="publicProfile2"
                                    className="grow"
                                >
                                    <h6 className="mb-1">Make Contact Info Public</h6>
                                    <p className="text-gray-500 dark:text-dark-500">
                                        Allow anyone viewing your profile to access your
                                        contact information.
                                    </p>
                                </div>
                                <label htmlFor="publicProfile2" className="switch-group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            id="publicProfile2"
                                            className="sr-only peer"
                                        />
                                        <div className="switch-wrapper"></div>
                                        <div className="switch-dot peer-checked:translate-x-full rtl:peer-checked:-translate-x-full switch-primary"></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h6 className="card-title">Delete Account</h6>
                </div>
                <div className="card-body">
                    <p className="mb-3 text-gray-500 dark:text-dark-500">
                        Please proceed with caution, as deleting your account and all
                        associated data from our organization is a permanent action
                        and cannot be undone.
                    </p>
                    <button className="btn btn-red">Delete Account</button>
                </div>
            </div>
        </>
    );
};
export default AccountSettings;
