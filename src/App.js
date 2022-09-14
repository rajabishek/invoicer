import "./App.css";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { v4 as uuid } from "uuid";
import moment from "moment";
import BillingDetails from "./components/BillingDetails.component";
import InvoiceSummary from "./components/InvoiceSummary.component";
import BankDetails from "./components/BankDetails.component";
import QRCode from "./components/QRCode.component";

import {
  Layout,
  Menu,
  Input,
  Col,
  Row,
  message,
  DatePicker,
  Typography,
  Space,
  Button,
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

function App() {
  let [invoiceItems, setInvoiceItems] = useState([
    {
      key: uuid(),
      item: "Consulting - Retainer",
      quantity: 1,
      rate: 10000,
      amount: 10000,
      tax: 10,
      total: 11000,
    },
    {
      key: uuid(),
      item: "Incentive",
      quantity: 1,
      rate: 2000,
      amount: 2000,
      tax: 20,
      total: 2400,
    },
  ]);

  const downloadReference = useRef();
  let [isPrinting, setIsPrinting] = useState(false);

  let [invoiceBasic, setInvoiceBasic] = useState({
    number: "INV00001",
    date: moment(),
    due: moment().add(3, "days"),
  });

  const handleInvoiceBasicChange = (value, input) => {
    value = input === "number" ? value.target.value : value;
    setInvoiceBasic((prev) => ({ ...prev, [input]: value }));
  };

  let [author, setAuthor] = useState({
    name: "Your name",
    address: "1101 Tirupati Apts, C Wing Bhulabhai Desai Road, Jacob Circle",
  });

  let [vendor, setVendor] = useState({
    name: "Acme Corporation Inc.",
    address:
      "23/27, 2nd Lane,kumbharwada, Sant Sena Maharaj Marg, Near J J Hospital, Kumbharwada",
  });

  let [accountDetails, setAccountDetails] = useState({
    holderName: "Account Holder Name",
    number: "009999890917",
    ifsc: "ICIC111122",
    type: "Current",
    bank: "ICICI Bank",
    upi: "name@bankname",
  });

  const dateFormat = "DD/MM/YYYY";

  const printPDF = useReactToPrint({
    content: () => downloadReference.current,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  const handlePrint = () => {
    if (!invoiceBasic.number) {
      message.warning("Please enter an invoice number");
      return;
    }
    if (!invoiceBasic.date) {
      message.warning("Please enter an invoice date");
      return;
    }
    if (!invoiceBasic.due) {
      message.warning("Please enter an invoice due date");
      return;
    }
    printPDF();
  };

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={[
            { key: 1, label: "Invoices" },
            { key: 2, label: "Downloads" },
          ]}
        />
      </Header>
      <Content className="main-container">
        <Space
          direction="horizontal"
          style={{ width: "100%", justifyContent: "right" }}
        >
          <Button
            type="primary"
            onClick={handlePrint}
            className="download-invoice-button"
            icon={<DownloadOutlined />}
          >
            Download Invoice as PDF
          </Button>
        </Space>

        <div className="site-layout-content" ref={downloadReference}>
          <Title>Invoice</Title>
          <Space
            direction="vertical"
            size={isPrinting ? 0 : 20}
            style={{ display: "flex" }}
          >
            <Row type="flex" align="middle">
              <Col span={4}>
                <Text strong>Invoice No </Text>
              </Col>
              <Col span={4}>
                <Input
                  value={invoiceBasic.number}
                  status={invoiceBasic.number ? null : "error"}
                  placeholder="Enter a invoice no."
                  bordered={isPrinting ? false : true}
                  onChange={(e) => handleInvoiceBasicChange(e, "number")}
                />
              </Col>
            </Row>

            <Row type="flex" align="middle">
              <Col span={4}>
                <Text strong>Invoice Date</Text>
              </Col>
              <Col span={4}>
                <DatePicker
                  bordered={isPrinting ? false : true}
                  value={invoiceBasic.date}
                  status={invoiceBasic.date ? null : "error"}
                  format={dateFormat}
                  style={{ width: "100%" }}
                  onChange={(e) => handleInvoiceBasicChange(e, "date")}
                  suffixIcon={isPrinting ? null : <CalendarOutlined />}
                />
              </Col>
            </Row>

            <Row type="flex" align="middle">
              <Col span={4}>
                <Text strong>Invoice Due Date</Text>
              </Col>
              <Col span={4}>
                <DatePicker
                  bordered={isPrinting ? false : true}
                  value={invoiceBasic.due}
                  format={dateFormat}
                  status={invoiceBasic.due ? null : "error"}
                  onChange={(e) => handleInvoiceBasicChange(e, "due")}
                  suffixIcon={isPrinting ? null : <CalendarOutlined />}
                  style={{ width: "100%" }}
                />
              </Col>
            </Row>
          </Space>

          <Row className="billing-details-container">
            <Col span={12}>
              <Row>
                <Col span={18}>
                  <BillingDetails
                    isPrinting={isPrinting}
                    title="Billed by"
                    person={author}
                    setPerson={setAuthor}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={18} offset={6}>
                  <BillingDetails
                    isPrinting={isPrinting}
                    title="Billed to"
                    person={vendor}
                    setPerson={setVendor}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <InvoiceSummary
            isPrinting={isPrinting}
            invoiceItems={invoiceItems}
            setInvoiceItems={setInvoiceItems}
          />
          <Row className="bank-details-container">
            <Col span={10}>
              <BankDetails
                accountDetails={accountDetails}
                isPrinting={isPrinting}
                setAccountDetails={setAccountDetails}
              />
            </Col>
            <Col span={10} offset={4}>
              <QRCode amount={126} accountDetails={accountDetails} />
            </Col>
          </Row>
          <Title level={5}>Terms and Conditions</Title>
          <ul>
            <li>
              Please pay within 15 days, overdue interest @ 14% will be charged
              on delayed payments
            </li>
            <li>Please quote invoice number when remitting funds.</li>
          </ul>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Made with ❤️ by <a href="https://twitter.com/the_heedo">Heedo</a> ©2022
      </Footer>
    </Layout>
  );
}

export default App;
