import { FaLock } from "react-icons/fa";

interface OrderProps {
  orderId: string;
  clientName: string;
  moveDate: string;
  asset: string;
  commodity: string;
  source: string;
  destination: string;
  price: string;
  cost: string;
  status: string;
}

const OrderCard: React.FC<OrderProps> = ({
  orderId,
  clientName,
  moveDate,
  asset,
  commodity,
  source,
  destination,
  price,
  cost,
  status,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
      <div className="flex justify-between items-center">
        <span className="text-orange-500 font-semibold">ORD{orderId}</span>
        <span className="bg-orange-400 text-white px-2 py-1 rounded flex items-center gap-1">
          <FaLock /> Locked
        </span>
      </div>
      <p className="text-gray-700 mt-1">
        <strong>Client Name:</strong> {clientName}
      </p>
      <p className="text-gray-700">
        <strong>Move Date:</strong> {moveDate}
      </p>
      <p className="text-gray-700">
        <strong>Asset:</strong> {asset}
      </p>
      <p className="text-gray-700">
        <strong>Commodity:</strong> {commodity}
      </p>
      <p className="text-gray-700">
        <strong>Source:</strong> {source}
      </p>
      <p className="text-gray-700">
        <strong>Destination:</strong> {destination}
      </p>
      <div className="flex justify-between mt-3">
        <span className="text-blue-600 font-semibold">SAR {price}</span>
        <span className="text-gray-600">Order Cost: SAR {cost}</span>
      </div>
      <div className="mt-3 text-right">
        <span className="bg-gray-300 px-3 py-1 rounded">{status}</span>
      </div>
    </div>
  );
};

export default OrderCard;
