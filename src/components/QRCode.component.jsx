import { Typography } from "antd";
import QRCodeGenerator from "react-qr-code";

const { Paragraph, Title } = Typography;

export default function QRCode(props) {
  return (
    <>
      <Title level={5}>UPI - Scan to Pay</Title>
      <QRCodeGenerator
        value={`upi://pay?pa=${props.accountDetails.upi}&pn=Sailesh&am=${props.amount}`}
        size={130}
      />
      <Paragraph>{props.accountDetails.upi}</Paragraph>
    </>
  );
}
