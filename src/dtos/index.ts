import {InterNationalization, MainMenu, MegaMenu, NextPageWithLayout, SubMenu,} from "@dtos/layout";

import {
    ProfileState,
    CreateEducationData,
    CreateExperienceData,
    Education,
    Experience,
    PersonalInfo,
    TypeOptionsDataRecord,
    UpdatePersonalInfoData,
    UserDocumentFileRecord,
    UserDocumentsFolderRecord,
    UserDocumnentMediaRecord,
    UserFollowerRecord,
    UserProjectRecord,
} from "@dtos/userProfile.ts";

import {
    AuthState,
    AuthStats,
    ActivityLog,
    LoginData,
    LoginResponse,
    RegisterData,
    ChangePasswordData,
    ResetPasswordData,
    User,
    VerifyEmailData,
    Session

} from
        '@dtos/auth.ts'


export type {
    ProfileState,
    AuthState,
    AuthStats,ActivityLog,LoginData,LoginResponse,RegisterData,
    ChangePasswordData,
    ResetPasswordData,
    User,VerifyEmailData,Session,

    CreateEducationData,
    CreateExperienceData,
    Education,
    Experience,
    PersonalInfo,
    UpdatePersonalInfoData,
    NextPageWithLayout,
    InterNationalization,
    MegaMenu,
    MainMenu,
    SubMenu,
    TypeOptionsDataRecord,
    UserFollowerRecord,
    UserDocumnentMediaRecord,
    UserDocumentFileRecord,
    UserDocumentsFolderRecord,
    UserProjectRecord,
};
