export function formatAmount(num) {
  return num.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
}

export const invoiceTableHeaders = [
  {
    title: "Item",
    dataIndex: "item",
    key: "item",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Rate",
    dataIndex: "rate",
    key: "rate",
  },
  {
    title: "Tax",
    dataIndex: "tax",
    key: "tax",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
  },
];
