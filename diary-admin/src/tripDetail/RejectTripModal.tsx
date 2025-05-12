import { Modal, Form, Input, message } from "antd";
import { rejectTrip } from "@/api/trip";

interface RejectTripModalProps {
  tripId: string;
  visible: boolean;
  onClose: (refresh?: boolean) => void;
}

const RejectTripModal = ({ tripId, visible, onClose }: RejectTripModalProps) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await rejectTrip(tripId, values.reason);
      message.success("已拒绝该行程");
      form.resetFields();
      onClose(true);
    } catch (error) {
      console.error("Error rejecting trip:", error);
    }
  };

  return (
    <Modal
      title="拒绝行程"
      open={visible}
      onOk={handleSubmit}
      onCancel={() => onClose()}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="reason"
          label="拒绝原因"
          rules={[{ required: true, message: "请输入拒绝原因" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RejectTripModal;