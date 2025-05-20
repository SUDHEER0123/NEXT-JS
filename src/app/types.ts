
export interface IFilters {
  label: string;
  value: string;
  options?: ISelectItem[];
  withIcon?: boolean;
  isMultiSelect?: boolean;
  type?: string;
  dateType?: string;
}

export interface OrderInventory {
  transitType: string;
  paymentUidArray?: string;
  updatedDate?: string;
  locationUid?: string;
  uid?: string;
  vehiclePrice?: number;
  stockUid?: string | null;
  orderUid?: string;
  createdDate?: string;
  vesselUrl?: string;
  vehicleUid?: string;
  optionPrice?: number;
  vesselTrackingNumber?: string;
  vesselName?: string;
  pdiImageArray?: string | null;
  billOfLandingDocument?: string | null;
}
export interface Color {
  color: string;
  hexCode: string;
  type: string;
  r: string | null;
  g: string | null;
  b: string | null;
}

export interface IVehicle { 
  year: number;
  contactUid: string;
  images: string[];
  intakeDate: string;
  heroImage: string;
  warrentyStartDate: string;
  intColor: Color;
  updatedDate: string;
  locationUid: string;
  uid: string;
  licensePlate: string;
  registrationDocument: string;
  createdDate: string;
  vinNumber: string;
  modelTypeUid: string;
  registrationDate: string;
  intakeOdometer: number;
  extColor: Color;
  registrationOdometer: number;
  status: string;
  ecosystemUiId: string;
  odometer?: number;
  vin?: string;
}

export interface ISelectItem {
  value: string;
  label: React.ReactNode | string;
  data?: Record<string, any>
  icon?: React.ReactNode;
  extraRightSection?: React.ReactNode;
}

export interface Contract {
  contractNo: string;
  contractDate: string;
  modelLine: string;
  customerName: string;
  vin: string;
  contractValue: number;
  openBalance: number;
  contractStatus: string;
  salesConsultant: string;
};

export interface Payment {
  id: string;
  date: string;
  amount: number;
  type: string;
  files: File[];
}
export interface Vehicle {
  id: string
  vehicleImage?: string;
  model: string;
  exteriorColor: string;
  interiorColor: string;
  orderNumber?: string;
  name?: string;
  orderStatus?: string;
  vehicleStatus: string;
  location?: string;
  vin: string;
  price: number;
}

export interface Tab {
  label: string;
  value: string;
  component?: React.ReactNode;
}

export interface Contact {
  id: string;
  avatar: string;
  name: string;
  phoneNumber: string;
  contactOwner: string;
  email: string;
  vehicleInterest: string;
  pipelineStage: string;
  vvip?: boolean;
}

export interface OrderTracker {
  uid: string;
  orderUid: string;
  vehicleStatus: string;
  createdDate: string;
  changedByUserUid: string;
  updatedDate: string;
  orderStatus: string;
}
export interface Stock {
  reservedDate: string | null;
  pdiImageArray: string | null;
  updatedDate: string;
  reservedStatus: string;
  configuratorCode: string;
  locationUid: string;
  uid: string;
  vehiclePrice: number;
  orderUid: string;
  createdDate: string;
  vesselUrl: string;
  configuratorDocumentUid: string;
  vehicleUid: string;
  reservedProspectUid: string;
  optionPrice: number;
  testDriveVehicle: boolean;
  vesselTrackingNumber: string;
  optionDocumentUid: string;
  vesselName: string;
  underQN: string[];
}
export interface IOrder {
  cancelDate: string | null;
  wholesaleInvoiceDueDate: string | null;
  contactUid: string;
  contractUid: string | null;
  cancelComment: string | null;
  discountAmount: number;
  customClearancePrice: number | null;
  customTransportPrice: number | null;
  updatedDate: string;
  type: string;
  totalVehiclePrice: number;
  consultantUserUid: string | null;
  forexRPCost: number;
  uid: string;
  orderNumber: string;
  forexBLCost: number;
  cancelConsultantUid: string | null;
  customClearanceDate: string;
  requestDate: string;
  depositPrice: number;
  wholesaleInvoiceAmount: number;
  ecosystemUid: string;
  placedDate: string;
  billOfLandingDocument: string | null;
  estimatedDeliveryDate: string;
  wholesaleInvoiceCreatedDate: string | null;
  locationUid: string;
  wholesaleInvoiceDocument: string | null;
  createdDate: string;
  paymentMethod: string;
  status: string;
  vehicleStatus: string;
  orderInventory: OrderInventory[];
  stock: Stock[];
  orderTracker: OrderTracker[];
  modelLine: string;
  heroImage: string;
  wholesaleOrderNumber: string;
}

export interface IOrderView {
  vehiclestatus: string;
  userlastname: string | null;
  orderstatus: string;
  userfirstname: string | null;
  fullnamefl: string;
  model: string;
  vinnumber: string;
  inventoryuid: string;
  type: string;
  configuratordocumentuid: string | null;
  opportunitynumber: string | null;
  placeddate: string;
  orderuid: string;
  contractuid: string | null;
  locationname: string;
  prospectuid: string | null;
  locationuid: string;
  ordernumber: string;
  contactuid: string;
  opportunityuid: string | null;
  heroimageicon: string;
  fullnameen: string;
  consultantuid: string | null;
  modeltypeuid: string;
  contractvalue: number | null;
  contractnumber: string | null;
  vehicleuid: string;
  userjobtitle: string | null;
  useravatar: string | null;
  licenseplate: string;
  ecosystemuid: string;
  estimateddeliverydate: string;
  primaryPhoneNo: {
    phoneNumber: string;
  }
  vehicleColor:{
    color: string;
    hexCode: string;
    type: 'hex' | 'rgb' | 'rgba' | string; 
    r: number | null;
    g: number | null;
    b: number | null;
    a?: number | null; 
  };
  depositAmount: number;
  orderUpdatedDate: string;
  inventoryfinanced?: boolean;
  cancelDate: string;
  heroImage: string;
}

export interface Order {
  id?: string
  vehicleImage?: string;
  modelLine: string;
  exteriorColor: string;
  uid: string;
  orderDate: string;
  name?: string;
  customerName?: string;
  status: string;
  vehicleStatus: string;
  location?: string;
  type: string;
  contractNo: string;
  contractValue: number;
  estArrivalDate?: string;
  licensePlate?: string;
  refundStatus?: string;
  depositAmount?: number;
  cancellationReason?: string;
  vin?: string;
  orderCancelDate?: string;
  orderLastUpdated?: string;
  orderStatusData?: {
    status: string;
    date: string;
    data: Record<string, any>;
  }[];
  salesConsultant?: string;
  openBalance?: number;
  requestDate?: string;
}

export interface ILocation {
  imges: string[];
  address2: string;
  city: string;
  address1: string;
  latitude: string;
  heroImage: string;
  updatedDate: string;
  logoUrl: string;
  uid: string;
  createdDate: string;
  province: string;
  phone: string;
  openTimes: {
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
  }[];
  name: string;
  postCode: string;
  brand: string;
  email: string;
  longitude: string;
  ecosystemUid: string; 
}

export interface IPayment {
  uid: string | null;
  type: string;
  date: string;
  amount: number;
  receipt: string;
  recordDate: string;
  recordUserUid: string | null;
  contractUid: string | null;
}
export interface IContract {
  contactUid?: string;
  orderInventoryUid?: string;
  orderUid?: string;
  ecosystemUid?: string;
  documentUid?: string;
  expectedDeliveryDate?: string;
  payments?: IPayment[];
  contractNumber?: string;
  customerInvoiceDocumentUid?: string;
  updatedDate?: string;
  recordUserUid?: string | null;
  consultantUserUid?: string | null;
  locationUid?: string;
  uid?: string;
  createdDate?: string;
  balance?: number;
  vehicleUid?: string;
  paymentMethod?: string;
  recordDate?: string | null;
  rejectionComment?: string | null;
  issueDate?: string | null;
  value?: number;
  lastChangedDate?: string | null;
  status?: string;
  refundStatus?: string | null;
  depositAmount?: number;
  discountAmount?: number;
}

export interface IUser {
  uid: string;
  ecosystemUid: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  createdDate: string;
  permissionRoleUid: string;
  jobTitle: string;
  avatar: string;
  updatedDate: string;
  koreanName: string;
  phoneNo: string;
  locationUids: string[];
}

export interface IContact {
  lastName: string;
  gender: string;
  homeNo: {
    phoneNumber: string;
  };
  companyName: string;
  createdDate: string;
  fullNameFL: string;
  bookingUidList: string;
  workNo: {
    phoneNumber: string;
  };
  uid: string;
  defaultLanguage: string;
  updatedDate: string;
  email: string;
  appUser: boolean;
  social: string;
  mobileNo: {
    phoneNumber: string;
  };
  fullNameEN: string;
  recordUserUid: string;
  designatedDriverName: string;
  firstName: string;
  dob: string;
  secondaryPhoneNo: string | null;
  companyRegNumber: string;
  recordDateTime: string;
  primaryPhoneNo: string | null;
  type: string | null;
  status: string;
  ecosystemUid: string;
  addresses: {
    apartmentHouseNo: string;
    uid: string;
    country: string;
    createdDate: string;
    province: string;
    city: string;
    contactUid: string;
    addressType: string;
    streetAddress1: string;
    streetAddress2: string;
    postCode: string;
    updatedDate: string;
  }[];
  preferences: {
    uid: string;
    createdDate: string;
    contactUid: string;
    serviceComm: string[];
    salesComm: string[];
    marketingComm: string[];
    updatedDate: string;
  };
  vvip?: boolean;
  avatar?: string;
  ownerUserUid: string;
}

export interface IModelType {
  images: string[];
  line: string;
  displayName: string;
  heroImage: string;
  bhp: number;
  updatedDate: string;
  intColor: {
    color: string;
    hexCode: string;
    type: string;
    r: string | null;
    g: string | null;
    b: string | null;
  }[];
  type: string;
  speed: number;
  heroImageIcon: string;
  uid: string;
  acceleration: number;
  createdDate: string;
  guestbookImage: string;
  model: string;
  extColor: {
    color: string;
    hexCode: string;
    type: string;
    r: string | null;
    g: string | null;
    b: string | null;
  }[];
  ecosystemUid: string;
  description: string;
  fobprice: number;
}

export interface ILead {
  uid: string;
  createdDate: string;
  contactUid: string;
  vehicleInterest: string[] | null;
  currentVehicle: string | null;
  interests: string[];
  updatedDate: string;
  priority: string | null;
  status: string | null;
  sourceChannel: string | null;
  locationUid: string | null;
  ecosystemUid: string;
  notes:{
  uid: string | null;
  ecosystemUid: string | null;
  opportunityUid: string | null;
  body: string;
  title: string | null;
  createdDate: string | null;
  updatedDate: string | null;
  recordUserUid: string | null;
  recordDateTime: string | null;
}[]|null;
  contact: IContact;
}

export interface IProspect {
  uid: string;
  isCustomer: boolean;
  convertContract: boolean;
  createdDate: string;
  contactUid: string;
  probability: number;
  vehicleInterest: string[] | null;
  updatedDate: string;
  consultantUid: string;
  inventoryUid: string;
  leadUid: string;
  ecosystemUid: string;
}

export type CreateDocumentPayload = {
  base64FileData: string;
  vehicleUid?: string | null;
  vin?: string | null;
  modelTypeUid?: string | null;
  modelTypeName?: string | null;
  orderUid?: string | null;
  orderNumber?: string | null;
  displayName?: string | null;
  name: string;
  description?: string | null;
  mimeType: string;
  type: 'vehicle' | 'contract' | 'invoice';
  status: string;
}

export type CreateDocumentResponse = {
  uid: string;
  path: string | null;
  createdDate: string;
  displayName: string;
  name: string;
  description: string | null;
  mimeType: string;
  updatedDate: string;
  type: 'vehicle' | 'contract' | 'invoice';
  url: string;
  status: string;
  ecosystemUid: string;
}

export interface IDocument {
  uid: string;
  path: string | null;
  createdDate: string;
  displayName: string;
  name: string;
  description: string;
  mimeType: string;
  updatedDate: string;
  type: string;
  url: string;
  status: string;
  ecosystemUid: string;
}