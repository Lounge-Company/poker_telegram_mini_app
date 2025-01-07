import { Row, Col, Typography } from "antd";

const { Text } = Typography;

interface MessageProps {
  username: string;
  message: string;
}

const Message = ({ username, message }: MessageProps) => {
  return (
    <Row
      style={{
        marginBottom: "10px",
        alignItems: "center",
        width: "100%"
      }}
    >
      {/* Username column */}
      <Col
        style={{
          width: "80px",
          flex: "0 0 auto",
          padding: "10px",
          alignSelf: "flex-start"
        }}
      >
        <Text
          strong
          style={{
            textAlign: "right",
            display: "block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "#d9d9d9"
          }}
        >
          {username}
        </Text>
      </Col>
      {/* Message column */}
      <Col style={{ flex: "1" }}>
        <div
          style={{
            backgroundColor: "#262626",
            borderRadius: "8px",
            padding: "10px",
            textAlign: "left",
            wordWrap: "break-word",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)"
          }}
        >
          <Text style={{ color: "#FFFFFF" }}>{message}</Text>
        </div>
      </Col>
    </Row>
  );
};

export default Message;
