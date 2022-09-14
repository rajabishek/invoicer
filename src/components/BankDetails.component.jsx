import {
  Col,
  Row,
  Card,
  Typography,
  Drawer,
  Space,
  Select,
  Form,
  Button,
  Input,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const { Text } = Typography;
const { Option } = Select;

export default function BankDetails(props) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  // const handleChange = (value, input) => {
  //   value = typeof value === "object" ? value.target.value : value;
  //   props.setAccountDetails((prev) => ({ ...prev, [input]: value }));
  // };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    form.setFieldsValue(props.accountDetails);
  };

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        //form.resetFields();
        console.log(values);
        props.setAccountDetails({ ...values });
        form.setFieldsValue({ ...values });
        setOpen(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <>
      <Drawer
        title="Edit Bank Details"
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onSubmit} type="primary">
              Save
            </Button>
          </Space>
        }
      >
        <Form
          layout="vertical"
          hideRequiredMark
          initialValues={props.accountDetails}
          form={form}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Account Holder"
                name="holderName"
                rules={[
                  {
                    required: true,
                    message: "Please enter the name of the account holder",
                  },
                ]}
              >
                <Input placeholder="Please enter the account holder's name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Account Number"
                name="number"
                rules={[
                  {
                    required: true,
                    message: "Please enter the account number",
                  },
                  {
                    pattern: /^[a-zA-Z0-9]+$/,
                    message:
                      "Account number can only include letters and numbers.",
                  },
                ]}
              >
                <Input placeholder="Please enter the account number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="IFSC Code"
                name="ifsc"
                rules={[
                  {
                    required: true,
                    message: "Please enter the IFSC Code",
                  },
                ]}
              >
                <Input placeholder="Please enter the IFSC Code" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Account Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please choose the type of account",
                  },
                ]}
              >
                <Select placeholder="Please choose the type of account">
                  <Option value="Current">Current</Option>
                  <Option value="Savings">Savings</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Bank Name"
                name="bank"
                rules={[
                  {
                    required: true,
                    message: "Please enter the name of the bank",
                  },
                ]}
              >
                <Input placeholder="Please enter the name of the bank" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="UPI Address"
                name="upi"
                rules={[
                  {
                    required: true,
                    message: "Please enter a valid UPI address",
                  },
                ]}
              >
                <Input placeholder="Please enter your UPI address" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <Card
        size="small"
        title="Bank Details"
        extra={
          <EditOutlined
            key="edit"
            style={{ display: props.isPrinting ? "none" : "inline-block" }}
            onClick={showDrawer}
          />
        }
      >
        <Row>
          <Col span={12}>Account Holder</Col>
          <Col span={12} className="text-right">
            <Text type="secondary">{props.accountDetails.holderName}</Text>
          </Col>
        </Row>
        <Row>
          <Col span={12}>Account Number</Col>
          <Col span={12} className="text-right">
            <Text type="secondary">{props.accountDetails.number}</Text>
          </Col>
        </Row>
        <Row>
          <Col span={12}>IFSC</Col>
          <Col span={12} className="text-right">
            <Text type="secondary">{props.accountDetails.ifsc}</Text>
          </Col>
        </Row>
        <Row>
          <Col span={12}>Account Type</Col>
          <Col span={12} className="text-right">
            <Text type="secondary">{props.accountDetails.type}</Text>
          </Col>
        </Row>
        <Row>
          <Col span={12}>Bank</Col>
          <Col span={12} className="text-right">
            <Text type="secondary">{props.accountDetails.bank}</Text>
          </Col>
        </Row>
      </Card>
    </>
  );
}
