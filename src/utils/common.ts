interface HighlightRange {
  start: number;
  end: number;
}

interface SplitResult {
  before: string;
  highlight: string;
  after: string;
}

export function camelCaseToSentence(camelCaseStr: string): string {
  if (!camelCaseStr) return "";

  // Insert space before each capital letter and convert the string to lowercase
  const spacedString = camelCaseStr.replace(/([A-Z])/g, " $1");

  // Capitalize the first letter and return the result
  return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
}

export function splitByHighlight(text: string, range: HighlightRange): SplitResult {
  const { start, end } = range;

  return {
    before: text.slice(0, start),
    highlight: text.slice(start, end),
    after: text.slice(end),
  };
}

export function formatMobileNumber(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.length < 12) {
    return '--'
  }
  const countryCode = digits.slice(0, 2);
  const carrier = digits.slice(2, 4);
  const part1 = digits.slice(4, 8);
  const part2 = digits.slice(8, 12);
  return `+${countryCode}-${carrier}-${part1}-${part2}`;
}

export const formatNumberWithCommas = (numberString: number | undefined | null, currency = '₩'): string => {
  if(numberString === undefined || numberString===null || isNaN(Number(numberString))) {
    return "";
  }

  const num = Number(numberString);

  return `${currency} ${num.toLocaleString()}`;
}

export const matchesDateFilter = (orderDateStr: string, filterOption: string): boolean => {
  const orderDate = new Date(orderDateStr);
  const now = new Date();

  switch (filterOption) {
    case 'This Month':
      return orderDate.getUTCMonth() === now.getUTCMonth() && orderDate.getUTCFullYear() === now.getUTCFullYear();

    case 'Last Month': {
      const lastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1));
      return orderDate.getUTCMonth() === lastMonth.getUTCMonth() && orderDate.getUTCFullYear() === lastMonth.getUTCFullYear();
    }

    case 'This Year':
      return orderDate.getUTCFullYear() === now.getUTCFullYear();

    case 'Last Year':
      return orderDate.getUTCFullYear() === now.getUTCFullYear() - 1;

    case 'This Week': {
      const dayDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      return orderDate.getUTCDay() <= now.getUTCDay() && dayDiff < 7;
    }

    case 'Last Week': {
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      const dayDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      return dayDiff >= 7 && dayDiff < 14;
    }

    case 'This Quarter': {
      const currentQuarter = Math.floor((now.getUTCMonth() + 3) / 3);
      const orderQuarter = Math.floor((orderDate.getUTCMonth() + 3) / 3);
      return currentQuarter === orderQuarter && orderDate.getUTCFullYear() === now.getUTCFullYear();
    }

    case 'Last Quarter': {
      const currentQuarter = Math.floor((now.getUTCMonth() + 3) / 3);
      const lastQuarter = currentQuarter - 1;
      const orderQuarter = Math.floor((orderDate.getUTCMonth() + 3) / 3);
      return lastQuarter === orderQuarter && orderDate.getUTCFullYear() === now.getUTCFullYear();
    }

    default: {
      // Assume custom format (e.g., exact ISO date string)
      const customDate = new Date(filterOption);
      return orderDate.getUTCFullYear() === customDate.getUTCFullYear() &&
             orderDate.getUTCMonth() === customDate.getUTCMonth();
    }
  }
};

export const VEHICLE_STATUSES = [
  "Order Standby",
  "Ordered Stock",
  "Ordered Retail",
  "Ordered Demo",
  "Ordered Showroom",
  "Ordered PR",
  "Sales Order by HQ",
  "PTS by HQ",
  "In Transit by HQ",
  "Port Arrival",
  "Storage in PDC after Custom",
  "Under PDI",
  "Under QN",
  "Stock Inventory",
  "Showroom Suwon",
  "Under 2nd PDI",
  "Customer Handover",
  "Others with Memo"
];

export const ORDER_STATUSES = [
  "Order Placed & Contracted",
  "Order in Production",
  "Order in Transit",
  "Order Arrived",
  "Order Cleared Customs",
  "Order Delivered to Stock",
  "Order Delivered to Showroom",
  "Order Delivered to Dealer",
  "Order Delivered to Customer",
  "Order Cancelled",
  "Order Archived"
];

export const CONTRACT_STATUSES = [
  "Contract Approved",
  "Contract Rejected",
  "Contract Open",
  "Contract Closed",
  "Contract Cancelled",
  "Contract Archived"
];