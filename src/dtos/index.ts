//  all types :)

// -------- Layout type ------- :)
import {
  NextPageWithLayout,
  InterNationalization,
  MegaMenu,
  MainMenu,
  SubMenu,
} from "./layout";

// -------- Landing ------- :)
import {
  HealthServiceData,
  ExpertDoctorData,
  PatientData,
  StudentsReviewData,
  EcommerceLandingProduct,
} from "./landing";

// -------- Dashboard ------- :)
import { Campaign, Transaction } from "./apps/campaignperformance";
// -------- Apps ------- :)
// ecommerce =====================
import { ProductListItem, ProductCategory } from "./apps/products";

import { ProductGridItem } from "./apps/productgrid";

// customer ======================
import { CustomerRecord } from "./apps/customer";

// calendar ======================

// projects ======================
import { ProjectList } from "./apps/projects";

//payroll==================
import { employeeSalary } from "./apps/employeeSalary";

//departments ================
import { departments } from "./apps/departments";

// shop cart ================
import { ShopCartProduct } from "./apps/shop_cart";

// checkout ================
import {
  // CheckoutProduct,
  CheckoutProductAddress,
  // CheckoutProductRecord,
} from "./apps/checkout";

// wishlist ================
import { WishListProduct } from "./apps/wishlist";

//patient =================
import { Patients } from "./apps/patients";

//overview =================
import { Reports, Medicine, Appointments } from "./apps/overview";

// crm =================
import { CrmContactItems } from "./apps/crm";

import { LeadItem } from "./apps/crmlead";

import { DealMessage, DealItem } from "./apps/crmdeal";

//event list

import { EventList } from "./apps/eventList";
import { EventGrid, Contributor } from "./apps/eventGrid";

//staff attendance - leave ================

import { LeaveForm, Leaves } from "./apps/staffleaveadd";

//staff
import { Holidays } from "./apps/holidays";

import { Attendance } from "./apps/staffattendance";

import { StaffLeaves } from "./apps/staffleaves";

import { StaffList } from "./apps/stafflists";

import { TodayAppointments } from "./apps/todayAppointments";


//school

import { LibraryBook } from "./apps/library_book";
import { ExamSchedule } from "./apps/exam_schedule";
import { Parents } from "./apps/parents";
import { TeacherPayroll } from "./apps/teachers_payroll";
import { TeacherListList } from "./apps/teachers_list";
import { StudentList } from "./apps/students_list";
import { ExamQuestion } from "./apps/exam_question";

// manage reviews =================
import { UserReviewRecord } from "./apps/manage_reviews";

// Email ==============================
import { Email, Replys } from "./apps/mail";

// order ==============================
import { OrderListItem } from "./apps/orderlist";

// category list ======================

import { CategoryItems } from "./apps/category";

// Invoice ============================

import { InvoiceList, ProductInfo } from "./apps/invoice";

// User profilePics =======================
import {
  TypeOptionsDataRecord,
  UserFollowerRecord,
  UserDocumnentMediaRecord,
  UserDocumentFileRecord,
  UserDocumentsFolderRecord,
  UserProjectRecord,
} from "./pages/userprofile";

// chat =======================
import {
  UserChatMessageRecord,
  UserChatRecord,
  MenuChatSidebarRecord,
  GroupChatMember,
  GroupChatMessage,
  GroupChatRecord,
  ContactChatRecord,
  GroupChatMemberRecord,
} from "./apps/chat";

import {
  GroupVideoCallMemberRecord,
  GroupKeyWordRecord,
  GroupVideoCallChatRecord,
} from "./apps/video";

export type {
  // dashboards
  Campaign,
  Transaction,

  // components type
  NextPageWithLayout,
  InterNationalization,
  MegaMenu,
  MainMenu,
  SubMenu,

  // landing
  HealthServiceData,
  ExpertDoctorData,
  PatientData,
  StudentsReviewData,
  EcommerceLandingProduct,

  // ecommerce
  ProductListItem,
  ProductCategory,
  ShopCartProduct,
  ProductGridItem,

  // customer
  CustomerRecord,

  // crm
  CrmContactItems,
  LeadItem,
  DealMessage,
  DealItem,

  // projects
  ProjectList,

  // user profilePics
  TypeOptionsDataRecord,
  UserFollowerRecord,
  UserDocumnentMediaRecord,
  UserDocumentFileRecord,
  UserDocumentsFolderRecord,
  UserProjectRecord,

  //hostipal

  //payroll
  employeeSalary,

  //departments
  departments,

  // checkout
  // CheckoutProduct,
  // CheckoutProductAddress,
  // CheckoutProductRecord,

  // wishlist
  WishListProduct,

  //EventList
  EventList,

  //EventGrid
  EventGrid,
  Contributor,

  //hostipal patients
  Patients,
  Reports,
  Medicine,
  Appointments,

  //staff-leave-add
  LeaveForm,
  Leaves,

  //Holidays
  Holidays,
  Attendance,

  //orderlist
  OrderListItem,

  //LeaveForm
  StaffLeaves,
  StaffList,

  // Appointments
  TodayAppointments,

  LibraryBook,
  ExamSchedule,
  Parents,
  TeacherPayroll,
  TeacherListList,
  StudentList,
  ExamQuestion,

  // manage reviews
  UserReviewRecord,

  // Email
  Email,
  Replys,

  // category list
  CategoryItems,

  // Invoice
  InvoiceList,
  ProductInfo,

  // checkout
  CheckoutProductAddress,

  // chat
  UserChatMessageRecord,
  UserChatRecord,
  GroupChatMember,
  MenuChatSidebarRecord,
  GroupChatMessage,
  GroupChatRecord,
  ContactChatRecord,
  GroupVideoCallMemberRecord,
  GroupKeyWordRecord,
  GroupVideoCallChatRecord,
  GroupChatMemberRecord,
};
