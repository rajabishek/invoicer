import { Card, Typography, Form, Input, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function BillingDetails(props) {
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

  return (
    <>
      <Modal
        open={open}
        title={props.title}
        okText="Save"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={onSubmit}
      >
        <Form
          layout="vertical"
          hideRequiredMark
          initialValues={props.person}
          form={form}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <TextArea type="textarea" />
          </Form.Item>
        </Form>
      </Modal>
      <Card
        size="small"
        title={props.title}
        extra={
          <EditOutlined
            key="edit"
            style={{ display: props.isPrinting ? "none" : "inline-block" }}
            onClick={() => {
              setOpen(true);
            }}
          />
        }
      >
        <Title level={5}>{props.person.name}</Title>
        <Paragraph
          type="secondary"
          ellipsis={
            props.isPrinting
              ? false
              : { rows: 2, expandable: true, symbol: "more" }
          }
        >
          {props.person.address}
        </Paragraph>
      </Card>
    </>
  );
}
