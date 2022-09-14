import {
  Col,
  Row,
  Typography,
  Divider,
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Space,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { formatAmount } from "../Helpers";
import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { invoiceTableHeaders } from "../Helpers";

const { Text } = Typography;

export default function InvoiceSummary(props) {
  let [columns, setColumns] = useState([
    ...invoiceTableHeaders,
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, invoice) => {
        return (
          <Space size="middle">
            <EditOutlined onClick={() => handleEditInvoice(invoice)} />
            <DeleteOutlined
              onClick={() => deleteInvoice(invoice)}
              style={{ color: "red" }}
            />
          </Space>
        );
      },
    },
  ]);

  if (props.isPrinting && columns.length === 7) {
    setColumns((prev) => prev.filter((col) => col.dataIndex !== "action"));
  }

  if (props.isPrinting === false && columns.length === 6) {
    setColumns((prev) => {
      return [
        ...prev,
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
          hidden: true,
          render: (_, invoice) => (
            <Space size="middle">
              <EditOutlined onClick={() => handleEditInvoice(invoice)} />
              <DeleteOutlined
                onClick={() => deleteInvoice(invoice)}
                style={{ color: "red" }}
              />
            </Space>
          ),
        },
      ];
    });
  }

  const [isEditing, setIsEditing] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  function handleEditInvoice(invoice) {
    setOpen(true);
    setEditingInvoice(invoice);
    form.setFieldsValue(invoice);
  }

  function changeInvoice() {
    props.setInvoiceItems((prev) =>
      prev.map((data) => {
        if (data.key === editingInvoice.key) {
          return {
            ...editingInvoice,
            amount: editingInvoice.quantity * editingInvoice.rate,
            total:
              Math.floor(
                editingInvoice.quantity *
                  editingInvoice.rate *
                  (editingInvoice.tax / 100 + 1) *
                  100
              ) / 100,
          };
        } else {
          return data;
        }
      })
    );
    setEditingInvoice(null);
    setOpen(false);
  }

  function addInvoice() {
    const newInvoice = {
      key: uuid(),
      item: "New Item",
      quantity: 1,
      rate: 10000,
      amount: 10000,
      tax: 20,
      total: 30000,
    };

    props.setInvoiceItems((pre) => {
      return [...pre, newInvoice];
    });
  }

  function deleteInvoice(invoice) {
    Modal.confirm({
      title: "Are you sure, you want to delete this invoice item?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        props.setInvoiceItems((prev) =>
          prev.filter((data) => data.key !== invoice.key)
        );
      },
    });
  }

  const [open, setOpen] = useState(false);

  const onCancel = () => {
    setOpen(false);
    form.setFieldsValue(props.person);
  };

  const [form] = Form.useForm();

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        props.setPerson({ ...values });
        form.setFieldsValue({ ...values });
        setOpen(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // function formatInvoiceItems(items) {
  //   return items.map((item) => {
  //     let newItem = { ...item };
  //     newItem.rate = formatAmount(newItem.rate);
  //     newItem.amount = formatAmount(newItem.amount);
  //     newItem.total = formatAmount(newItem.total);
  //     return newItem;
  //   });
  // }

  function computeTotal(items, property = "total") {
    if (property === "total") {
      return items.reduce((partialSum, item) => partialSum + item.total, 0);
    } else {
      return items.reduce(
        (partialSum, item) => partialSum + item.total - item.amount,
        0
      );
    }
  }

  // const formatedInvoiceItems = formatInvoiceItems(props.invoiceItems);

  let totalTax = computeTotal(props.invoiceItems, "tax");
  let totalAmount = computeTotal(props.invoiceItems);
  let total = totalTax + totalAmount;

  return (
    <>
      <Modal
        open={open}
        title="Edit Invoice Item"
        okText="Save"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={changeInvoice}
      >
        <Form layout="vertical" hideRequiredMark form={form}>
          <Form.Item
            name="item"
            label="Item name"
            placeholder="Enter the item name"
            rules={[
              {
                required: true,
                message: "Please enter the item name",
              },
            ]}
          >
            <Input
              value={editingInvoice?.item}
              onChange={(e) => {
                setEditingInvoice((prev) => {
                  return { ...prev, item: e.target.value };
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            placeholder="Enter the quantity"
            rules={[
              {
                required: true,
                message: "Please enter the quanity of items",
              },
            ]}
          >
            <InputNumber
              value={editingInvoice?.quantity}
              onChange={(value) => {
                setEditingInvoice((prev) => {
                  return { ...prev, quantity: value };
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="rate"
            label="Rate"
            placeholder="Enter the rate"
            rules={[
              {
                required: true,
                message: "Please enter the rate",
              },
            ]}
          >
            <InputNumber
              value={editingInvoice?.rate}
              onChange={(value) => {
                setEditingInvoice((prev) => {
                  return { ...prev, rate: value };
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="tax"
            label="Tax"
            placeholder="Enter the tax"
            rules={[
              {
                required: true,
                message: "Please enter the tax as percentage",
              },
            ]}
          >
            <InputNumber
              value={editingInvoice?.tax}
              onChange={(value) => {
                setEditingInvoice((prev) => {
                  return { ...prev, tax: value };
                });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={props.invoiceItems}
        pagination={false}
        className="invoice-items"
        footer={() => (
          <Row>
            <Col span={6}>
              <Button
                type="default"
                icon={<PlusOutlined />}
                onClick={addInvoice}
                className="add-invoice-item-button"
                style={{ display: props.isPrinting ? "none" : "inline-block" }}
              >
                Add invoice item
              </Button>
            </Col>
            <Col offset={16} span={8}>
              <Row>
                <Col span={12}>Amount</Col>
                <Col span={12} className="text-right">
                  <Text type="secondary">{formatAmount(totalAmount)}</Text>
                </Col>
              </Row>
              <Row>
                <Col span={12}>Tax</Col>
                <Col span={12} className="text-right">
                  <Text type="secondary">{formatAmount(totalTax)}</Text>
                </Col>
              </Row>
              <Divider />
              <Row>
                <Col span={12}>
                  <Text strong>Total (INR)</Text>
                </Col>
                <Col span={12} className="text-right">
                  <Text strong>{formatAmount(total)}</Text>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      />
    </>
  );
}
